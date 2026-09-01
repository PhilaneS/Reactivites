using Application.Activities.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core.MappingProfiles;

public class ActivityProfile : Profile
{
    public ActivityProfile()
    {
        CreateMap<Activity, ActivityDto>();
        CreateMap<ActivityDto, Activity>();
    }
}
