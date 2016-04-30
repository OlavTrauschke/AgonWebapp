package nl.asrvagon;

import java.io.*;
import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.http.*;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.util.Zip4jConstants;

/**
 * TODO document
 * 
 * @author Olav Trauschke
 * @version 30-apr-2016
 */
public class EmailServlet extends HttpServlet {
    
    private static final String FILE_PW = "test";//TODO set encryption pw
    
    private static InternetAddress FROM;
    static {
        try {
            FROM = new InternetAddress(FROM_STRING);
        }
        catch (AddressException ae) {
            System.out.println("FROM was found to be an invalid address.");
        }
    }
    
    private static InternetAddress TO;
    static {
        try {
            TO = new InternetAddress("secretaris@srvagon.nl");
        }
        catch(AddressException ae) {
            System.out.println("TO was found to be an invalid address.");
        }
    }
    
    /**
     * TODO document
     */
    public static final String SUBJECT = "Webformulier ingevuld";
    
    /**
     * TODO document
     */
    public static final String MAIL_BODY = "Beste secretaris van A.S.R.V. Agon,\n"
            + "In de bijlage vind je de antwoorden die iemand op een formulier op "
            + "de website van de vereniging heeft ingevuld.";
    
    /**
     * TODO document
     */
    public static final Properties PROPERTIES = System.getProperties();
    static {
        PROPERTIES.put("mail.transport.protocol", "smtp");
        PROPERTIES.put("mail.smtp.ssl.enable", true);
        PROPERTIES.put("mail.smtp.host", "smtp.gmail.com");
        PROPERTIES.put("mail.smtp.port", 465);
        PROPERTIES.put("mail.smtp.user", FROM_STRING);
        PROPERTIES.put("mail.smtp.password", MAIL_PW);
        PROPERTIES.put("mail.smtp.auth", true);
        PROPERTIES.put("mail.smtp.ssl.trust", "smtp.gmail.com");
    }
    
    /**
     * TODO document.
     *
     * @param request servlet request
     * @param response servlet response
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        String sessionId = request.getSession().getId();
        FileWriter writer = null; //show compiler intentions
        try {
            File output = File.createTempFile(sessionId, ".csv");
            writer = new FileWriter(output);
            Map parameters = request.getParameterMap();
            Set<Map.Entry> entrySet = parameters.entrySet();
            for (Map.Entry entry : entrySet) {
                String key = (String) entry.getKey();
                String[] valueArray = (String[]) entry.getValue();
                StringBuilder valueBuilder = new StringBuilder();
                for (String s : valueArray) {
                    valueBuilder.append(s);
                }
                String value = valueBuilder.toString();
                writer.write(key + ";" + value + System.lineSeparator());
            }
            writer.close();
            File zipFile = compress(output, sessionId, response);
            deleteFile(output);
            if (zipFile == null) {
                handleInternalServerError(response);
            }
            else {
                send(zipFile, response);
            }
        }
        catch (IOException ioe) {
            if (writer != null) {
                try {
                    writer.close();
                }
                catch (IOException ioe3) {}
            }
            System.out.println("Handling request failed: " + ioe);
            handleInternalServerError(response);
        }
    }
    
    /**
     * TODO document
     */
    private File compress(File input, String sessionId, HttpServletResponse response) {
        String tempDir = System.getProperty("java.io.tmpdir");
        File resultFile = new File(tempDir, sessionId + ".zip");
        try {
            ZipFile zipFile = new ZipFile(resultFile);
            ArrayList<File> filesToAdd = new ArrayList<>();
            filesToAdd.add(input);
            ZipParameters parameters = new ZipParameters();
            parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
            parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_FAST);
            parameters.setEncryptFiles(true);
            parameters.setEncryptionMethod(Zip4jConstants.ENC_METHOD_STANDARD);
            parameters.setPassword(FILE_PW);
            zipFile.addFiles(filesToAdd, parameters);
            return resultFile;
        }
        catch (ZipException ze) {
            System.out.println("Compression of file " + input.getAbsolutePath()
                    + " into " + resultFile.getAbsolutePath() + " failed");
            return null;
        }
    }
    
    /**
     * TODO document
     */
    private void send(File attachement, HttpServletResponse response) {
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM_STRING, MAIL_PW);
            }
        };
        Session session = Session.getInstance(PROPERTIES, authenticator);
        MimeMessage mail = new MimeMessage(session);
        try {
            mail.setFrom(FROM);
            mail.addRecipient(Message.RecipientType.TO, TO);
            mail.setSubject(SUBJECT);
            Multipart mailContent = new MimeMultipart();
            MimeBodyPart mailBody = new MimeBodyPart();
            mailBody.setText(MAIL_BODY);
            mailContent.addBodyPart(mailBody);
            MimeBodyPart attachementPart = new MimeBodyPart();
            attachementPart.attachFile(attachement);
            mailContent.addBodyPart(attachementPart);
            mail.setContent(mailContent);
            Transport transport = session.getTransport();
            transport.connect();
            transport.sendMessage(mail, mail.getAllRecipients());
            transport.close();
        }
        catch (IOException ioe) {
            System.out.println("Attatching file to email failed: " + ioe);
            handleInternalServerError(response);
            return;
        }
        catch (NoSuchProviderException nspe) {
            System.out.println("Failed to use email provider for transport: " + nspe);
            handleInternalServerError(response);
            return;
        }
        catch(MessagingException me) {
            System.out.println("Sending email failed: " + me);
            handleInternalServerError(response);
            return;
        }
        finally {
            deleteFile(attachement);
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    /**
     * TODO document
     */
    private void deleteFile(File toDelete) {
        if (!toDelete.delete()) {
            //deletion failed, try again
            if (!toDelete.delete()) {
                System.out.println("Deletion of " + toDelete.getAbsolutePath()
                        + " failed.");
            }
        }
    }
    
    /**
     * TODO document
     */
    private void handleInternalServerError(HttpServletResponse response) {
        try {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occured while handling your request. "
                  + "Please try again and contact us if this error keeps appearing.");
        }
        catch (IOException ioe) {
            System.out.println("Setting error message failed");
        }
    }
    
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Servlet that handles contact forms by sending them to the secretary.";
    }

}
