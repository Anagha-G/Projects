using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using log4net;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private static readonly ILog Logger = LogManager.GetLogger(typeof(OtpController));
        private readonly OtpService _otpService;
        private readonly List<User> _users = new(); // Simulating a database

        public OtpController(OtpService otpService)
        {
            _otpService = otpService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                Logger.Info($"Received registration request for email: {user.Email}");

                if (_users.Exists(u => u.Email == user.Email))
                {
                    Logger.Warn($"Registration failed: User with email {user.Email} already exists.");
                    return BadRequest(new { Message = "User already exists." });
                }

                _users.Add(user); // Add user to simulated database
                Logger.Info($"User {user.Email} added to the database.");

                var otp = await _otpService.GenerateOtpAsync(user.Email);
                Logger.Debug($"Generated OTP for {user.Email}: {otp}");

                await _otpService.SendOtpEmailAsync(user.Email, otp);
                Logger.Info($"OTP sent successfully to {user.Email}.");

                return Ok(new { Message = "User registered. Please verify your email with the OTP." });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during registration for email {user.Email}.", ex);
                return StatusCode(500, new { Message = $"An error occurred during registration: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            try
            {
                Logger.Info($"Received login request for email: {loginModel.Email}");

                var user = _users.Find(u => u.Email == loginModel.Email && u.Password == loginModel.Password);
                if (user == null)
                {
                    Logger.Warn($"Login failed for email {loginModel.Email}: Invalid email or password.");
                    return Unauthorized(new { Message = "Invalid email or password." });
                }

                var otp = await _otpService.GenerateOtpAsync(loginModel.Email);
                Logger.Debug($"Generated OTP for {loginModel.Email}: {otp}");

                await _otpService.SendOtpEmailAsync(loginModel.Email, otp);
                Logger.Info($"OTP sent successfully to {loginModel.Email}.");

                return Ok(new { Message = "Login successful. Please verify your email with the OTP." });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during login for email {loginModel.Email}.", ex);
                return StatusCode(500, new { Message = $"An error occurred during login: {ex.Message}" });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] string Email, string Otp)
        {
            try
            {
                Logger.Info($"Received OTP verification request for email: {Email}");

                var isValid = await _otpService.ValidateOtpAsync(Email, Otp);
                if (isValid)
                {
                    Logger.Info($"OTP verified successfully for email: {Email}");
                    return Ok(new { Message = "OTP verified successfully." });
                }

                Logger.Warn($"OTP verification failed for email: {Email}. Invalid or expired OTP.");
                return BadRequest(new { Message = "Invalid or expired OTP." });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred while verifying OTP for email {Email}.", ex);
                return StatusCode(500, new { Message = $"An error occurred while verifying the OTP: {ex.Message}" });
            }
        }
    }
}