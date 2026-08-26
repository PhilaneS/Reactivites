using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    public class Command : IRequest<bool>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, bool>
    {
        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .SingleOrDefaultAsync(activity => activity.Id == request.Id, cancellationToken);

            if (activity is null)
            {
                return false;
            }

            context.Activities.Remove(activity);
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}