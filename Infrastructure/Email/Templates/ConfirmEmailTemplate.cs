namespace Infrastructure.Email.Templates
{
    public class ConfirmEmailTemplate
    {
        public static string Create( string displayName,
        string confirmationLink)
        {
          return $"""
            <html>
            <body>
                <h2>Confirm your email address</h2>

                <p>Hi {displayName},</p>

                <p>
                    Please confirm your email by clicking the link below:
                </p>

                <p>
                    <a href="{confirmationLink}">
                        Click here to verify your email
                    </a>
                </p>

                <p>Thanks</p>
            </body>
            </html>
            """;  
        }
        
    }
}