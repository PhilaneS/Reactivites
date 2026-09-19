using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PaginationParams<TCursor>
    {
        public TCursor? Cursor { get; set; }
        private const int MaxPageSize = 50;
        private int _pageSize = 3;

        public int pageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}