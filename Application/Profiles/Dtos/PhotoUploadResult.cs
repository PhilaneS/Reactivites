using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles.Dtos
{
    public class PhotoUploadResult
    {
        public required string PublicId { get; set; }

        public required string Url { get; set; }
    }
}