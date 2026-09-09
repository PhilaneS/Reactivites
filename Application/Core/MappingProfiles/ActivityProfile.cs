using Application.Activities.DTOs;
using Application.Profiles.Dtos;
using AutoMapper;
using Domain;

namespace Application.Core.MappingProfiles;

public class ActivityProfile : Profile
{
    public ActivityProfile()
    {
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        //CreateMap<EditActivityDto, Activity>();
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostDisplayName, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            .ForMember(d => d.HostId, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));

        CreateMap<ActivityAttendee,UserProfileDto>()
            .ForMember(d=> d.DisplayName, o=> o.MapFrom(s=>s.User.DisplayName))
            .ForMember(d=> d.Bio, o=> o.MapFrom(s=>s.User.Bio))
            .ForMember(d=> d.ImageUrl, o=> o.MapFrom(s=>s.User.ImageUrl))
            .ForMember(d=> d.Id, o=> o.MapFrom(s=>s.User.Id));

    }
}
