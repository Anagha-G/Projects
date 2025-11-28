using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public interface IAuthService
    {
        Task<(int status, string result)> Registration(User model);
        Task<(int status, string result)> VerifyAndRegister(User model, string otp);
        Task<(int status, string result)> Login(LoginModel model);
        Task<(int status, string result)> VerifyAndLogin(LoginModel model, string otp);
        Task<(int status, string result)> ForgotPassword(string email);
        Task<(int status, string result)> VerifyOtpResetPassword(LoginModel model, string otp);
        Task<User> GetUserById(int userId);
    }
}