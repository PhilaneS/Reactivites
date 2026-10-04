using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Accounts.commands
{
    public class ConfirmEmail
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string? UserId { get; set; }
            public string? Code { get; set; }
        }

        public class Handler(
            UserManager<User> userManager) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.UserId))
                {
                    return Result<Unit>.Failure(
                        "User id must be provided",
                        400);
                }

                if (string.IsNullOrWhiteSpace(request.Code))
                {
                    return Result<Unit>.Failure(
                        "Confirmation code must be provided",
                        400);
                }

                var user = await userManager.FindByIdAsync(request.UserId);

                if (user is null)
                {
                    return Result<Unit>.Failure(
                        "User not found",
                        404);
                }

                if (user.EmailConfirmed)
                {
                    return Result<Unit>.Failure(
                        "Email is already confirmed",
                        400);
                }

                var result = await userManager.ConfirmEmailAsync(
                    user,
                    request.Code);
                if (!result.Succeeded)
                {
                    var errors = string.Join(
                        ", ",
                        result.Errors.Select(error => error.Description));

                    return Result<Unit>.Failure(
                        $"Email confirmation failed: {errors}",
                        400);
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}