using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands
{
    public class SetMainPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string PhotoId { get; set; }
        }

        public class Handler(AppDbContext context, IUserAccessor userAccessor)
            : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userAccessor.GetUserWithPhotosAsync();
                var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

                if (photo is null)
                {
                    return Result<Unit>.Failure("Photo not found", 404);
                }

                user.ImageUrl = photo.Url;

                return await context.SaveChangesAsync(cancellationToken) > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Problem setting main photo", 400);
            }
        }
    }
}