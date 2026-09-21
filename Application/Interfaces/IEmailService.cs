using Domain;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task SendConfirmationEmailAsync(
        string email,
        string displayName,
        string confirmationLink,
        CancellationToken cancellationToken = default);

        Task SendPasswordResetEmailAsync(
            string email,
            string displayName,
            string resetLink,
            CancellationToken cancellationToken = default);
    }
}