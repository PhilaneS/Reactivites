using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest
    {
        public required Activity Activity { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .SingleOrDefaultAsync(activity => activity.Id == request.Activity.Id, cancellationToken) ?? throw new Exception("Activity not found.");
            activity.Title = request.Activity.Title;
            activity.Date = request.Activity.Date;
            activity.Description = request.Activity.Description;
            activity.Category = request.Activity.Category;
            activity.IsCancelled = request.Activity.IsCancelled;
            activity.City = request.Activity.City;
            activity.Venue = request.Activity.Venue;
            activity.Latitude = request.Activity.Latitude;
            activity.Longitude = request.Activity.Longitude;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}