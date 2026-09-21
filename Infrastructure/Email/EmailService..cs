using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Infrastructure.Email.Templates;
using Resend;

namespace Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly IResend _resend;
        private readonly ResendOptions _options;

        public EmailService(IResend resend, ResendOptions options)
        {
            _resend = resend;
            _options = options;
        }
        public async Task SendConfirmationEmailAsync(
            string email,
            string displayName,
            string confirmationLink,
            CancellationToken cancellationToken = default)
        {

            var body = ConfirmEmailTemplate.Create(
            displayName,
            confirmationLink);

            var message = new Resend.EmailMessage
            {
                From = $"{_options.FromName} <{_options.FromEmail}>",
                Subject = "Confirm your email address",
                HtmlBody = body
            };

            message.To.Add(email);

            await _resend.EmailSendAsync(message);

        }

        public async Task SendPasswordResetEmailAsync(
        string email,
        string displayName,
        string resetLink,
        CancellationToken cancellationToken = default)
        {
            var body = PasswordResetTemplate.Create(
                        displayName,
                        resetLink);

            var message = new Resend.EmailMessage
            {
                From = $"{_options.FromName} <{_options.FromEmail}>",
                Subject = "Reset your password",
                HtmlBody = body
            };

            message.To.Add(email);

            await _resend.EmailSendAsync(message);
        }
    }
}