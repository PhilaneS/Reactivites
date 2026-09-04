using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace Application.Core
{
    public class ValidationBehaviour<TRequest, Tresposnce>(IValidator<TRequest>? validator = null)
        : IPipelineBehavior<TRequest, Tresposnce> where TRequest : notnull
    {
        public async Task<Tresposnce> Handle(TRequest request, RequestHandlerDelegate<Tresposnce> next, CancellationToken cancellationToken)
        {
            if(validator == null) return await next();

            var validationResult = await validator.ValidateAsync(request,cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            return await next();
        }
    }
}