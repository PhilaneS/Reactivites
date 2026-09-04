using Application.Activities.DTOs;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditActivityDto EditActivityDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .SingleOrDefaultAsync(activity => activity.Id == request.EditActivityDto.Id, cancellationToken);

            if (activity is null) return Result<Unit>.Failure("Activity not found", 404);

            activity.Title = request.EditActivityDto.Title;
            activity.Description = request.EditActivityDto.Description;
            activity.Category = request.EditActivityDto.Category;
            activity.Date = request.EditActivityDto.Date;
            activity.City = request.EditActivityDto.City;
            activity.Venue = request.EditActivityDto.Venue;
            //activity.IsCancelled = request.EditActivityDto.IsCancelled;
            activity.Latitude = request.EditActivityDto.Latitude;
            activity.Longitude = request.EditActivityDto.Longitude;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to update the activity", 404);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}