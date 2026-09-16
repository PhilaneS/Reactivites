using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Core.MappingProfiles;
using API.Tests.TestInfrastructure;
using AutoMapper;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace API.Tests.Activities.Commands;

public sealed class ActivityCommandHandlerTests : SqliteTestBase
{
    [Fact]
    public async Task CreateActivity_WhenActivityIsValid_PersistsActivityAndReturnsId()
    {
        var activityDto = CreateActivityDto("New activity");
        var mapper = new MapperConfiguration(
            configuration => configuration.AddProfile<ActivityProfile>(),
            NullLoggerFactory.Instance).CreateMapper();
        var userAccessor = new TestUserAccessor();
        Context.Users.Add(userAccessor.User);
        await Context.SaveChangesAsync();
        var handler = new CreateActivity.Handler(Context, mapper, userAccessor);

        var result = await handler.Handle(
            new CreateActivity.Command { ActivityDto = activityDto },
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        var savedActivity = await Context.Activities.FindAsync(result.Data);
        Assert.NotNull(savedActivity);
        Assert.Equal(result.Data, savedActivity.Id);
        Assert.Equal("New activity", savedActivity.Title);
    }

    [Fact]
    public async Task EditActivity_WhenActivityExists_UpdatesAllEditableProperties()
    {
        var activity = CreateActivity("Original title");
        Context.Activities.Add(activity);
        await Context.SaveChangesAsync();

        var updatedActivity = new EditActivityDto
        {
            Id = activity.Id,
            Title = "Updated title",
            Date = DateTime.UtcNow.AddDays(1),
            Description = "Updated description",
            Category = "music",
            City = "Paris",
            Venue = "Updated venue",
            Latitude = 48.8,
            Longitude = 2.3
        };
        var handler = new EditActivity.Handler(Context);

        await handler.Handle(
            new EditActivity.Command { EditActivityDto = updatedActivity },
            CancellationToken.None);

        var savedActivity = await Context.Activities.FindAsync(activity.Id);
        Assert.NotNull(savedActivity);
        Assert.Equal(updatedActivity.Title, savedActivity.Title);
        Assert.Equal(updatedActivity.Date, savedActivity.Date);
        Assert.Equal(updatedActivity.Description, savedActivity.Description);
        Assert.Equal(updatedActivity.Category, savedActivity.Category);
        Assert.Equal(updatedActivity.City, savedActivity.City);
        Assert.Equal(updatedActivity.Venue, savedActivity.Venue);
        Assert.Equal(updatedActivity.Latitude, savedActivity.Latitude);
        Assert.Equal(updatedActivity.Longitude, savedActivity.Longitude);
    }

    [Fact]
    public async Task EditActivity_WhenActivityDoesNotExist_ThrowsExceptionWithNotFoundMessage()
    {
        var handler = new EditActivity.Handler(Context);
        var command = new EditActivity.Command
        {
            EditActivityDto = new EditActivityDto { Id = "missing-id" }
        };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal("Activity not found", result.Error);
    }

    [Fact]
    public async Task DeleteActivity_WhenActivityExists_RemovesActivityAndReturnsTrue()
    {
        var activity = CreateActivity("Activity to delete");
        Context.Activities.Add(activity);
        await Context.SaveChangesAsync();
        var handler = new DeleteActivity.Handler(Context);

        var result = await handler.Handle(
            new DeleteActivity.Command { Id = activity.Id },
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Null(await Context.Activities.FindAsync(activity.Id));
    }

    [Fact]
    public async Task DeleteActivity_WhenActivityDoesNotExist_ReturnsFalseAndDoesNotChangeDatabase()
    {
        var existingActivity = CreateActivity("Existing activity");
        Context.Activities.Add(existingActivity);
        await Context.SaveChangesAsync();
        var handler = new DeleteActivity.Handler(Context);

        var result = await handler.Handle(
            new DeleteActivity.Command { Id = "missing-id" },
            CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal(1, await Context.Activities.CountAsync());
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

    private static CreateActivityDto CreateActivityDto(string title) => new()
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

    private sealed class TestUserAccessor : IUserAccessor
    {
        public User User { get; } = new()
        {
            Id = "test-user",
            UserName = "test@example.com",
            Email = "test@example.com",
            DisplayName = "Test User"
        };

        public string GetUserId() => User.Id;
        public Task<User> GetUserAsync() => Task.FromResult(User);
        public Task<User> GetUserWithPhotosAsync() => Task.FromResult(User);
    }
}
