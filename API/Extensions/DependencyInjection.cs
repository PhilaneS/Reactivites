using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Infrastructure.Email;
using Resend;

namespace API.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var resendApiKey = configuration["ResentEmailSettings:ApiKey"]
            ?? throw new InvalidOperationException("Resend API key is not configured.");

            var resendOptions = new ResendOptions
            {
                ApiKey = resendApiKey,
                FromEmail = configuration["ResentEmailSettings:FromEmail"] ?? "",
                FromName = configuration["ResentEmailSettings:FromName"] ?? ""
            };

             services.AddSingleton(resendOptions);

        services.AddResend(options =>
        {
            options.ApiToken = resendApiKey;
        });

        services.AddScoped<IEmailService, EmailService>();

            return services;
        }

    }
}