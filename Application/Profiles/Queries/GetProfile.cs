using Application.Core;
using Application.Profiles.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries
{
    public class GetProfile
    {
        public class Query : IRequest<Result<UserProfileDto>>
        {
            public required string UserId { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<UserProfileDto>>
        {
            public async Task<Result<UserProfileDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profile = await context.Users
                    .ProjectTo<UserProfileDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id == request.UserId,cancellationToken);

                return profile is null
                    ? Result<UserProfileDto>.Failure("Profile not found", 404)
                    : Result<UserProfileDto>.Success(profile);
            }
        }
    }
}