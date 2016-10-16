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
 * Servlet for emailing filled in forms to the secretary.
 * 
 * @author Olav Trauschke
 * @version 16-oct-2016
 */
public class EmailServlet extends HttpServlet {
    
    private static final String FILE_PW = "test";//TODO set encryption pw
    
    private static final long serialVersionUID = 132560487;
    
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
     * Subject header of emails sent by <code>this EmailServlet</code>.
     */
    public static final String SUBJECT = "Webformulier ingevuld";
    
    /**
     * Body of emails sent by <code>this EmailServlet</code>.
     */
    public static final String MAIL_BODY = "Beste secretaris van A.S.R.V. Agon,\n"
            + "In de bijlage vind je de antwoorden die iemand op een formulier op "
            + "de website van de vereniging heeft ingevuld.";
    
    /**
     * <code>Properties</code> for emails sent by <code>this EmailServlet</code>.
     */
    private static final Properties PROPERTIES = System.getProperties();
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
     * Handle data posted to <code>this EmailServlet</code> by writing it to a
     * csv-file, encrypting it and emailing it to the secretary.
     *
     * @param request an <code>HttpServletRequest</code> representing a request
     *                  to <code>this EmailServlet</code>, containing at least a
     *                  sessionId and a parametermap
     * @param response the <code>HttpServletResponse</code>
     *                  <code>this EmailServlet</code> can use to respond to
     *                  the <code>request</code> handled by the current call to
     *                  this method
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        assert request != null;
        
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
            File zipFile = compress(output, sessionId);
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
     * Compress a given <code>input</code> and write the result to an encrypted
     * zip-file stored in the default directory for storing temporary files.
     * 
     * @param input the <code>File</code> to compress
     * @param sessionId a <code>String</code> uniquely identifying the session
     *                  that generated the request that caused this method to be
     *                  called, used for naming the resulting temporary file
     * @return an encrypted compressed <code>File</code> containing the
     *          <code>input</code>, named <code>[sessionId].zip</code> and
     *          located in the default directory for storing temporary files,
     *          or <code>null</code> if an error occured
     */
    private File compress(File input, String sessionId) {
        assert input != null && sessionId != null;
        
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
     * Send a given <code>attachement</code> to the secretary and remove it.
     * 
     * @param attachment a <code>File</code> to send to the secretary
     * @param response an <code>HttpServletResponse</code> that can be used to
     *                  inform the user about any errors that occured during the
     *                  execution of this method
     */
    private void send(File attachement, HttpServletResponse response) {
        assert attachement != null;
        
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
     * Attempt to delete a specified <code>File</code> (twice to delete it in
     * case of e.g. deadlock occuring at the first try) and record failure at
     * the second attempt in the default log.
     * 
     * @param toDelete a <code>File</code> to delete
     */
    private void deleteFile(File toDelete) {
        assert toDelete != null;
        
        if (!toDelete.delete()) {
            //deletion failed, try again
            if (!toDelete.delete()) {
                System.out.println("Deletion of " + toDelete.getAbsolutePath()
                        + " failed.");
            }
        }
    }
    
    /**
     * Report an internal server error to a given
     * <code>HttpServletResponse</code> by setting the status to
     * <code>HttpServletResponse.SC_INTERNAL_SERVER_ERROR</code> with an
     * appropriate message. Record failure during execution of this reporting in
     * the default log.
     * 
     * @param response an <code>HttpServlet</code> response to report an
     *                  internal server error to
     */
    private void handleInternalServerError(HttpServletResponse response) {
        try {
            assert response != null;
            
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
