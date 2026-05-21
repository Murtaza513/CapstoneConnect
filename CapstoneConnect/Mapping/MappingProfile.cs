using AutoMapper;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.ViewModels;

namespace CapstoneConnect.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<SupervisorViewModel, Supervisor > ();
            CreateMap<Supervisor, SupervisorViewModel>();

            CreateMap<AddUser, SupervisorViewModel>();

            CreateMap<SupervisorViewModel, AddUser>();

            CreateMap<FypDescription, FypGroup>();
            CreateMap<MidEvaluation, Evaluations>();
            CreateMap<FinalEvaluation, Evaluations>();
        }
    }
}
