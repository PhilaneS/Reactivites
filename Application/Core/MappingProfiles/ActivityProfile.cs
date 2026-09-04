using Application.Activities.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core.MappingProfiles;

public class ActivityProfile : Profile
{
    public ActivityProfile()
    {
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();
    }
}
