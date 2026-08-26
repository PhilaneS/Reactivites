using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Activity?>
    {
        public required string Id { get; set; }
    }

    public class Hander(AppDbContext context) : IRequestHandler<Query, Activity?>
    {
        public async Task<Activity?> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities
                .FirstOrDefaultAsync(activity => activity.Id == request.Id, cancellationToken);
        }
    }
}