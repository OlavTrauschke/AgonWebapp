package nl.asrvagon;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet that displays the login-page, including an error on retry.
 * 
 * @author Olav Trauschke
 * @version 28-01-2016
 */
@WebServlet(name = "AuthenticationServlet", urlPatterns = {"/login"})
public class AuthenticationServlet extends HttpServlet {

    public static final String PAGE_START =
        "<!DOCTYPE html>\n"
         +  "<html>\n"
              + "<head>\n"
                  + "<title>Log in</title>\n"
                  + "<link rel=\"stylesheet\" type=\"text/css\" href=\"/test/style/form.css\" />\n"
                  + "<meta charset=\"UTF-8\" />\n"
                  + "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n"
              + "</head>\n"
              + "<body>\n"
                  + "<img src=\"/test/images/loginTop.jpg\" alt=\"Roeipanorama\" id=\"topFoto\" />\n"
                  + "<div id=\"content\">\n"
                        //TODO log in systeem maken
                      + "<p>\n"//temporary
                          + "Binnenkort kunnen leden hier inloggen op een beveiligd deel van deze website.\n"//temporary
                        //+ "Log in om toegang te krijgen tot informatie voor leden.\n"
                      + "</p>\n";
    public static final String ERROR_MESSAGE =
                        "<p class=\"error\">\n"
                          + "Inloggen mislukt. Probeer het opnieuw.\n"
                      + "</p>\n";
    
    public static final String PAGE_END =
                      //TODO log in systeem maken
                      /*"<form method=\"POST\" action=\"j_security_check\">\n"
                          + "<fieldset>\n"
                              + "<legend>Log in</legend>\n"
                              + "<label for=\"username\">Gebruikersnaam:</label>\n"
                              + "<input type=\"text\"\n"
                                     + "name=\"j_username\"\n"
                                     + "id=\"username\"\n"
                                     + "class=\"textInput\"\n"
                                    + "required />\n"
                              + "<br />\n"
                              + "<br />\n"
                              + "<label for=\"password\">Wachtwoord:</label>\n"
                              + "<input type=\"password\"\n"
                                     + "name=\"j_password\"\n"
                                     + "id=\"password\"\n"
                                     + "class=\"textInput\"\n"
                                     + "required />\n"
                              + "<br />\n"
                              + "<br />\n"
                              + "<input type=\"submit\" value=\"Log in\" />\n"
                          + "</fieldset>\n"
                      + "</form>\n"
                + */ "</div>\n"
              + "</body>\n"
          + "</html>";
    
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        String responseCode = PAGE_START;
        if (request.getParameter("failed") != null) {
            responseCode += ERROR_MESSAGE;
        }
        responseCode += PAGE_END;
        
        try (PrintWriter writer = response.getWriter()) {
            writer.print(responseCode);
        }
        
    }
    
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Servlet that displays the login-page, including an error on retry.";
    }

}
