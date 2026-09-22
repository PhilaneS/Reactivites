using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Application.Accounts.commands
{
    public class ConfirmEmail
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string? UserId { get; set; }
            public string? Email { get; set; }
        }

        public class Handler(
            UserManager<User> userManager,
            IEmailService emailService,
            IConfiguration configuration) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.UserId))
                {
                    return Result<Unit>.Failure("Email or user id must be provided", 400);
                }

                var user = !string.IsNullOrWhiteSpace(request.UserId)
                    ? await userManager.FindByIdAsync(request.UserId)
                    : await userManager.FindByEmailAsync(request.Email!);

                if (user is null || string.IsNullOrWhiteSpace(user.Email))
                    return Result<Unit>.Failure("User not found", 404);

                if (user.EmailConfirmed)
                    return Result<Unit>.Failure("Email is already confirmed", 400);

                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var clientUrl = configuration["ClientAppUrl"];
                if (string.IsNullOrWhiteSpace(clientUrl))
                    return Result<Unit>.Failure("Client application URL is not configured", 500);

                var confirmationUrl = $"{clientUrl}/confirm-email?userId={Uri.EscapeDataString(user.Id)}&code={Uri.EscapeDataString(token)}";
                await emailService.SendConfirmationEmailAsync(
                    user.Email,
                    user.DisplayName ?? user.Email,
                    confirmationUrl,
                    cancellationToken);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}