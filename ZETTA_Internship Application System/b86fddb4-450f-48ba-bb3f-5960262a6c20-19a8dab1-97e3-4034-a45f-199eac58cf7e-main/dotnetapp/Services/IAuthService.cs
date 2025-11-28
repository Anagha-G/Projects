using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;


namespace dotnetapp.Services
{
    public interface IAuthService
    {
        Task<(int, string)> Registration (User user, string role);
        Task<(int, string)> Login (LoginModel loginModel);
    }
}