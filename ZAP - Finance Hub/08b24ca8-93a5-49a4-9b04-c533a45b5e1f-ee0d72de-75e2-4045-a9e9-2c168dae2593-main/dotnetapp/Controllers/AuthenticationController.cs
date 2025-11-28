using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using log4net;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private static readonly ILog Logger = LogManager.GetLogger(typeof(AuthenticationController));

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                Logger.Info($"Received registration request for email: {model.Email}");

                if (!ModelState.IsValid)
                {
                    Logger.Warn($"Invalid payload for registration request for email: {model.Email}");
                    return BadRequest(new { status = "error", message = "Invalid payload" });
                }

                var (status, result) = await _authService.Registration(model);

                if (status == 0)
                {
                    Logger.Warn($"Registration failed for email: {model.Email}. Reason: {result}");
                    return BadRequest(new { status = "error", message = result });
                }

                Logger.Info($"Registration successful for email: {model.Email}");
                return Ok(new { status = "success", message = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during registration for email: {model.Email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during registration: {ex.Message}" });
            }
        }

        [HttpPost("verify-registration-otp")]
        public async Task<IActionResult> VerifyRegistrationOtp([FromBody] User model, [FromQuery] string otp)
        {
            try
            {
                Logger.Info($"Received OTP verification request for email: {model.Email}");

                var (status, result) = await _authService.VerifyAndRegister(model, otp);

                if (status == 0)
                {
                    Logger.Warn($"OTP verification failed for email: {model.Email}. Reason: {result}");
                    return BadRequest(new { status = "error", message = result });
                }

                Logger.Info($"OTP verification successful for email: {model.Email}");
                return Ok(new { status = "success", message = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during OTP verification for email: {model.Email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during OTP verification: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                Logger.Info($"Received login request for email: {model.Email}");

                var (status, result) = await _authService.Login(model);

                if (status == 0)
                {
                    Logger.Warn($"Login failed for email: {model.Email}. Reason: {result}");
                    return Unauthorized(new { status = "error", message = result });
                }

                Logger.Info($"Login successful for email: {model.Email}");
                return Ok(new { status = "success", token = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during login for email: {model.Email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during login: {ex.Message}" });
            }
        }

        [HttpPost("verify-login-otp")]
        public async Task<IActionResult> VerifyLoginOtp([FromBody] LoginModel model, [FromQuery] string otp)
        {
            try
            {
                Logger.Info($"Received OTP verification request for login email: {model.Email}");

                var (status, result) = await _authService.VerifyAndLogin(model, otp);

                if (status == 0)
                {
                    Logger.Warn($"OTP verification for login failed for email: {model.Email}. Reason: {result}");
                    return BadRequest(new { status = "error", message = result });
                }

                Logger.Info($"OTP verification for login successful for email: {model.Email}");
                return Ok(new { status = "success", message = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during OTP verification for login email: {model.Email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during OTP verification: {ex.Message}" });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromQuery] string email)
        {
            try
            {
                Logger.Info($"Received forgot-password request for email: {email}");

                var (status, result) = await _authService.ForgotPassword(email);

                if (status == 0)
                {
                    Logger.Warn($"Forgot-password request failed for email: {email}. Reason: {result}");
                    return BadRequest(new { status = "error", message = result });
                }

                Logger.Info($"Forgot-password request successful for email: {email}");
                return Ok(new { status = "success", message = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during forgot-password request for email: {email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during password reset request: {ex.Message}" });
            }
        }

        [HttpPut("verify-reset-otp")]
        public async Task<IActionResult> ResetPassword([FromBody] LoginModel model, [FromQuery] string otp)
        {
            try
            {
                Logger.Info($"Received OTP verification request for password reset email: {model.Email}");

                var (status, result) = await _authService.VerifyOtpResetPassword(model, otp);

                if (status == 0)
                {
                    Logger.Warn($"OTP verification for password reset failed for email: {model.Email}. Reason: {result}");
                    return BadRequest(new { status = "error", message = result });
                }

                Logger.Info($"Password reset successful for email: {model.Email}");
                return Ok(new { status = "success", message = result });
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred during password reset for email: {model.Email}", ex);
                return StatusCode(500, new { status = "error", message = $"An error occurred during password reset: {ex.Message}" });
            }
        }

        [HttpGet("Users/{userId}")]
        [Authorize(Roles = "RegionalManager, Customer")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                Logger.Info($"Received request to fetch details for userId: {userId}");

                var user = await _authService.GetUserById(userId);

                if (user == null)
                {
                    Logger.Warn($"User with ID {userId} not found.");
                    return NotFound(new { message = $"User with ID {userId} was not found." });
                }

                Logger.Info($"User with ID {userId} fetched successfully.");
                return Ok(user); // Return the user object directly
            }
            catch (Exception ex)
            {
                Logger.Error($"An error occurred while fetching details for userId: {userId}", ex);
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}