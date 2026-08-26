using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command : IRequest<Activity>
    {
        public required string Title { get; set; }
        public DateTime Date { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
        public bool IsCancelled { get; set; }
        public required string City { get; set; }
        public required string Venue { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Activity>
    {
        public async Task<Activity> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = new Activity
            {
                Title = request.Title,
                Date = request.Date,
                Description = request.Description,
                Category = request.Category,
                IsCancelled = request.IsCancelled,
                City = request.City,
                Venue = request.Venue,
                Latitude = request.Latitude,
                Longitude = request.Longitude
            };

            context.Activities.Add(activity);
            await context.SaveChangesAsync(cancellationToken);

            return activity;
        }
    }
}