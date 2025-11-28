using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly OtpService _otpService;

        public AuthService(IConfiguration configuration, ApplicationDbContext context, OtpService otpService)
        {
            _configuration = configuration;
            _context = context;
            _otpService = otpService;
        }

        public async Task<(int status, string result)> Registration(User model)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return (0, "User already exists");
            }

            // Generate and send OTP
            var otp = await _otpService.GenerateOtpAsync(model.Email);
            await _otpService.SendOtpEmailAsync(model.Email, otp);

            return (1, "OTP sent to email. Please verify the OTP.");
        }

        public async Task<(int status, string result)> VerifyAndRegister(User model, string otp)
        {
            // Validate OTP
            var isValidOtp = await _otpService.ValidateOtpAsync(model.Email, otp);
            if (!isValidOtp)
            {
                return (0, "Invalid or expired OTP.");
            }

            // Hash password using SHA256
            model.Password = HashPassword(model.Password);

            // Add user to database
            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return (1, "User created successfully.");
        }

        public async Task<(int status, string result)> Login(LoginModel model)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return (0, "Invalid email");
            }

            // Validate password
            if (user.Password != HashPassword(model.Password))
            {
                return (0, "Invalid password");
            }

            var otp = await _otpService.GenerateOtpAsync(model.Email);
            await _otpService.SendOtpEmailAsync(model.Email, otp);

            return (1, "OTP sent to email. Please verify the OTP.");

        }

        public async Task<(int status, string result)> VerifyAndLogin(LoginModel model, string otp)
        {
            // Validate OTP
            var isValidOtp = await _otpService.ValidateOtpAsync(model.Email, otp);
            if (!isValidOtp)
            {
                return (0, "Invalid or expired OTP.");
            }

            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            string token = GenerateToken(user);
            return (1, token);
        }


        public async Task<User> GetUserById(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }

        private string GenerateToken(User user)
        {
            var secretKey = _configuration["JWT:SecretKey"];
            var issuer = _configuration["JWT:ValidIssuer"];
            var audience = _configuration["JWT:ValidAudience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("userId", user.UserId.ToString()),
                new Claim("userName", user.Username),
                new Claim("email", user.Email),
                new Claim("role", user.UserRole)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddHours(1),
                claims: claims,
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        public async Task<(int status, string result)> ForgotPassword(string email)
        {
            // Check if user exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (0, "User with provided email does not exist.");
            }

            // Generate and send OTP
            var otp = await _otpService.GenerateOtpAsync(email);
            await _otpService.SendOtpEmailAsync(email, otp);

            return (1, "OTP sent to email. Please verify the OTP to reset your password.");
        }

        public async Task<(int status, string result)> VerifyOtpResetPassword(LoginModel model, string otp)
        {
            // Validate OTP
            var isValidOtp = await _otpService.ValidateOtpAsync(model.Email, otp);
            if (!isValidOtp)
            {
                return (0, "Invalid or expired OTP.");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
            {
                return (0, "User not found.");
            }

            // Generate a temporary password or accept a new password from the user
            string newPassword = model.Password; // Or get from model if provided
            user.Password = HashPassword(newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return (1, "Password updated successfully. Use the new password to log in.");


        }

    }
}