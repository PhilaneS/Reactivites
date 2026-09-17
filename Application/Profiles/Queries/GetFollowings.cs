using Application.Core;
using Application.Interfaces;
using Application.Profiles.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Persistence;

namespace Application.Profiles.Queries
{
    public class GetFollowings
    {
        public class Query : IRequest<Result<List<UserProfileDto>>>
        {
            public string Predicate { get; set; } = "followers";
            public required string UserId { get; set; }
        }
       public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<UserProfileDto>>>
    {
        public async Task<Result<List<UserProfileDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfileDto>();

            switch (request.Predicate)
            {
                case "followers":
                    profiles = await context.UserFollowings.Where(x => x.Target.Id == request.UserId)
                        .Select(x => x.Observer)
                        .ProjectTo<UserProfileDto>(mapper.ConfigurationProvider, 
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    profiles = await context.UserFollowings.Where(x => x.Observer.Id == request.UserId)
                        .Select(x => x.Target)
                        .ProjectTo<UserProfileDto>(mapper.ConfigurationProvider, 
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserProfileDto>>.Success(profiles);
        }
    } 
    }
}