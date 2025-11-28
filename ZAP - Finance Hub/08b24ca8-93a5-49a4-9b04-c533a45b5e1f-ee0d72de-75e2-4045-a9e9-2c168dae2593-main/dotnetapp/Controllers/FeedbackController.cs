using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        [Authorize(Roles = "RegionalManager")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacks();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving feedbacks.");
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbacksByUserId(userId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving feedbacks.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                if (feedback == null)
                    return BadRequest(new { message = "Feedback data is required." });

                bool success = await _feedbackService.AddFeedback(feedback);
                if (success)
                    return Ok(new { message = "Feedback added successfully." });

                return StatusCode(500, new { message = "Failed to add feedback." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding feedback." });
            }
        }

        [HttpDelete("{feedbackId}")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                bool success = await _feedbackService.DeleteFeedback(feedbackId);
                if (success)
                    return Ok(new { message = "Feedback deleted successfully." });

                return NotFound(new { message = "Cannot find any feedback." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting feedback." });
            }
        }
    }
}