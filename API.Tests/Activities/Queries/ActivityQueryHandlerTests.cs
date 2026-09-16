using Application.Activities.Queries;
using API.Tests.TestInfrastructure;
using Application.Core.MappingProfiles;
using AutoMapper;
using Domain;
using Microsoft.Extensions.Logging.Abstractions;

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

        var handler = new GetActivityList.Hander(Context, CreateMapper());

        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Contains(result, activity => activity.Id == first.Id);
        Assert.Contains(result, activity => activity.Id == second.Id);
    }

    [Fact]
    public async Task GetActivityList_WhenNoActivitiesExist_ReturnsEmptyList()
    {
        var handler = new GetActivityList.Hander(Context, CreateMapper());

        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetActivityDetails_WhenIdExists_ReturnsMatchingActivity()
    {
        var activity = CreateActivity("Target activity");
        Context.Activities.Add(activity);
        await Context.SaveChangesAsync();

        var handler = new GetActivityDetails.Hander(Context, CreateMapper());

        var result = await handler.Handle(
            new GetActivityDetails.Query { Id = activity.Id },
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result!.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(activity.Id, result.Data!.Id);
        Assert.Equal("Target activity", result.Data!.Title);
    }

    [Fact]
    public async Task GetActivityDetails_WhenIdDoesNotExist_ReturnsNull()
    {
        var handler = new GetActivityDetails.Hander(Context, CreateMapper());

        var result = await handler.Handle(
            new GetActivityDetails.Query { Id = "missing-id" },
            CancellationToken.None);

        Assert.False(result?.IsSuccess);
    }

    private static IMapper CreateMapper() => new MapperConfiguration(
        configuration => configuration.AddProfile<ActivityProfile>(),
        NullLoggerFactory.Instance).CreateMapper();

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
