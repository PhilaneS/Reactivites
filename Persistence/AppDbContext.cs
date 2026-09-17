using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
	public DbSet<Activity> Activities { get; set; }
	public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
	public DbSet<Photo> Photos { get; set; }
	public required DbSet<Comment> Comments { get; set; }

	public required DbSet<UserFollowing> UserFollowings { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);

		builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));

		builder.Entity<ActivityAttendee>()
			.HasOne(x => x.User)
			.WithMany(x => x.Activities)
			.HasForeignKey(x => x.UserId);

		builder.Entity<ActivityAttendee>()
		.HasOne(x => x.Activity)
		.WithMany(x => x.Attendees)
		.HasForeignKey(x => x.ActivityId);

		builder.Entity<UserFollowing>(b =>
		{
			b.HasKey(k => new { k.ObserverId, k.TargetId }).IsClustered(false);

			b.HasOne(o => o.Observer)
				.WithMany(f => f.Followings)
				.HasForeignKey(o => o.ObserverId)
				.OnDelete(DeleteBehavior.NoAction);
			b.HasOne(t => t.Target)
				.WithMany(f => f.Followers)
				.HasForeignKey(t => t.TargetId)
				.OnDelete(DeleteBehavior.NoAction);
		});

		var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
		   v => v.ToUniversalTime(), // Convert to UTC before saving
		   v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Read as UTC
	   );

		foreach (var entityType in builder.Model.GetEntityTypes())
		{
			foreach (var property in entityType.GetProperties())
			{
				if (property.ClrType == typeof(DateTime))
				{
					property.SetValueConverter(dateTimeConverter);
				}
			}
		}
	}
}

