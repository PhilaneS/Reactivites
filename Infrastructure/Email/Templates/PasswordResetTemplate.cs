namespace Infrastructure.Email.Templates
{
    public static class PasswordResetTemplate
    {
        public static string Create(
            string displayName,
            string resetLink)
        {
            return $"""
            <html>
            <body>
                <h2>Reset your password</h2>

                <p>Hi {displayName},</p>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    <a href="{resetLink}">
                        Reset your password
                    </a>
                </p>

                <p>
                    If you didn't request this, you can safely ignore this email.
                </p>

                <p>Thanks</p>
            </body>
            </html>
            """;
        }
    }
}