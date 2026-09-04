using Application.Activities.Queries;
using API.Tests.TestInfrastructure;
using Domain;

namespace API.Tests.Activities.Queries;

public sealed class ActivityQueryHandlerTests : SqliteTestBase
{
    [Fact]
    public async Task GetActivityList_WhenActivitiesExist_ReturnsAllActivities()
    {
        var first = CreateActivity("First activity");
        var second = CreateActivity("Second activity");
        Context.Activities.AddRange(first, second);
        await Context.SaveChangesAsync();

        var handler = new GetActivityList.Hander(Context);

        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Contains(result, activity => activity.Id == first.Id);
        Assert.Contains(result, activity => activity.Id == second.Id);
    }

    [Fact]
    public async Task GetActivityList_WhenNoActivitiesExist_ReturnsEmptyList()
    {
        var handler = new GetActivityList.Hander(Context);

        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetActivityDetails_WhenIdExists_ReturnsMatchingActivity()
    {
        var activity = CreateActivity("Target activity");
        Context.Activities.Add(activity);
        await Context.SaveChangesAsync();

        var handler = new GetActivityDetails.Hander(Context);

        var result = await handler.Handle(
            new GetActivityDetails.Query { Id = activity.Id },
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(activity.Id, result.Id);
        Assert.Equal("Target activity", result.Title);
    }

    [Fact]
    public async Task GetActivityDetails_WhenIdDoesNotExist_ReturnsNull()
    {
        var handler = new GetActivityDetails.Hander(Context);

        var result = await handler.Handle(
            new GetActivityDetails.Query { Id = "missing-id" },
            CancellationToken.None);

        Assert.Null(result);
    }

    private static Activity CreateActivity(string title) => new()
    {
        Title = title,
        Date = DateTime.UtcNow,
        Description = "Test description",
        Category = "culture",
        City = "London",
        Venue = "Test venue",
        Latitude = 51.5,
        Longitude = -0.1
    };
}
