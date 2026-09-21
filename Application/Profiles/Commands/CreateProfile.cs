using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.Dtos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Application.Profiles.Commands
{
    public class CreateProfile
    {
        public class Command : IRequest<IdentityResult>
        {
            public required RegisterDto Register { get; set; }
        }

        public class Handler(UserManager<User> userManager, IEmailService emailService,IConfiguration config) 
            : IRequestHandler<Command, IdentityResult>
        {
            public async Task<IdentityResult> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = new User
                {
                    UserName = request.Register.Email,
                    Email = request.Register.Email,
                    DisplayName = request.Register.DisplayName
                };

                var result = await userManager.CreateAsync(user, request.Register.Password);

                if (!result.Succeeded) return result;

                var token = await userManager
                            .GenerateEmailConfirmationTokenAsync(user);

                var confirmEmailUrl = $"{config["ClientAppUrl"]}/confirm-email?userId={user.Id}&code={token}";

                await emailService.SendConfirmationEmailAsync(user.Email,user.DisplayName,confirmEmailUrl,cancellationToken);

                return result;

            }
        }
    }
}