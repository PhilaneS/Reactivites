using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities.Queries;
using Application.Activities.Commands;

namespace API.Controllers;

public class ActivitiesController() : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new Application.Activities.Queries.GetActivityList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivity(string id)
    {
        var activity = await Mediator.Send(new GetActivityDetails.Query{Id = id});

        if (activity is null)
            return NotFound();
            
        return activity;
    }

    [HttpPost]
    public async Task<ActionResult<Activity>> CreateActivity(
        CreateActivity.Command command)
    {
        var activity = await Mediator.Send(command);

        return CreatedAtAction(nameof(GetActivity), new { id = activity.Id }, activity);
    }

    [HttpPut]
    public async Task<ActionResult<Activity>> EditActivity(Activity activity)
    {
        var command = new EditActivity.Command
        {
            Activity = activity
        };

         await Mediator.Send(command);        

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(string id)
    {
        var deleted = await Mediator.Send(new DeleteActivity.Command
        {
            Id = id
        });

        return deleted ? NoContent() : NotFound();
    }
}