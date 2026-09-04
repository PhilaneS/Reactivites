using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }

        public string? Error { get; set; }
        public int Code { get; set; }

        public static Result<T> Success(T data) => new()
        {
            IsSuccess = true,
            Data = data
        };
        public static Result<T> Failure(string error, int code) => new()
        {
            IsSuccess = false,
            Error = error,
            Code = code
        };

    }
}