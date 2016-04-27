package nl.asrvagon;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.util.Zip4jConstants;

/**
 * TODO document
 * 
 * @author Olav Trauschke
 * @version 27-apr-2016
 */
public class EmailServlet extends HttpServlet {
    
    private static final String PW = "test";//TODO set encryption pw
    
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
            output.delete();
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
            handleInternalServerError(response);
        }
    }
    
    /**
     * TODO document
     */
    private File compress(File input, String sessionId, HttpServletResponse response) {
        String tempDir = System.getProperty("java.io.tmpdir");
        try {
            File resultFile = new File(tempDir, sessionId + ".zip");
            ZipFile zipFile = new ZipFile(resultFile);
            ArrayList<File> filesToAdd = new ArrayList<>();
            filesToAdd.add(input);
            ZipParameters parameters = new ZipParameters();
            parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
            parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_FAST);
            parameters.setEncryptFiles(true);
            parameters.setEncryptionMethod(Zip4jConstants.ENC_METHOD_STANDARD);
            parameters.setPassword(PW);
            zipFile.addFiles(filesToAdd, parameters);
            return resultFile;
        }
        catch (ZipException ze) {
            return null;
        }
    }
    
    /**
     * TODO document
     */
    private void send(File attachement, HttpServletResponse response) {
        //TODO send attachement
        attachement.delete();
        response.setStatus(HttpServletResponse.SC_OK);
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
        catch (IOException ioe) {}
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
