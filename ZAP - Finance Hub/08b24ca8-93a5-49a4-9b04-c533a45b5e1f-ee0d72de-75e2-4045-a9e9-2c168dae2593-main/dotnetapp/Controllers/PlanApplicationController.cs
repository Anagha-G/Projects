using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanApplicationController : ControllerBase
    {
        private readonly IPlanApplicationService _planApplicationService;
        private readonly ISavingsPlanService _savingsPlanService;

        public PlanApplicationController(IPlanApplicationService planApplicationService, ISavingsPlanService savingsPlanService)
        {
            _planApplicationService = planApplicationService;
            _savingsPlanService = savingsPlanService;
        }

        [HttpGet]
        [Authorize(Roles = "RegionalManager")]
        public async Task<ActionResult<IEnumerable<PlanApplication>>> GetAllPlanApplications()
        {
            try
            {
                var planApplications = await _planApplicationService.GetAllPlanApplications();
                return Ok(planApplications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpGet("{applicationId}")]
        [Authorize(Roles = "RegionalManager, Customer")]
        public async Task<ActionResult> GetPlanApplicationById(int applicationId)
        {
            try
            {
                var planApplication = await _planApplicationService.GetPlanApplicationById(applicationId);

                if (planApplication == null)
                {
                    return NotFound(new { message = "Plan Application Not Found." });
                }
                return Ok(planApplication);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult> AddPlanApplication([FromBody] PlanApplication planApplication)
        {
            try
            {
                var savingsPlan = await _savingsPlanService.GetSavingsPlanById(planApplication.SavingsPlanId);
                if (savingsPlan == null)
                {
                    return BadRequest(new { message = "Associated savings plan does not exist." });
                }

                if (planApplication.AppliedAmount > savingsPlan.GoalAmount)
                {
                    return BadRequest(new { message = "Applied amount exceeds the goal amount of the savings plan." });
                }

                var result = await _planApplicationService.AddPlanApplication(planApplication);
                if (result)
                {
                    return Ok(new { message = "Plan application successfully added." });
                }
                return StatusCode(500, new { message = "An error occurred while adding the plan application." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while adding the plan application: {ex.Message}" });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult> GetPlanApplicationsByUserId(int userId)
        {
            try
            {
                var planApplications = await _planApplicationService.GetPlanApplicationsByUserId(userId);
                return Ok(planApplications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPut("{applicationId}")]
        [Authorize(Roles = "RegionalManager, Customer")]
        public async Task<ActionResult> UpdatePlanApplication(int applicationId, [FromBody] PlanApplication planApplication)
        {
            try
            {
                var result = await _planApplicationService.UpdatePlanApplication(applicationId, planApplication);
                if (result)
                {
                    return Ok(new { message = "Plan application successfully updated." });
                }
                return NotFound(new { message = "Plan application not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating the plan application: {ex.Message}" });
            }
        }

        [HttpDelete("{applicationId}")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult> DeletePlanApplication(int applicationId)
        {
            try
            {
                var result = await _planApplicationService.DeletePlanApplication(applicationId);
                if (result)
                {
                    return Ok(new { message = "Plan application successfully deleted." });
                }
                return NotFound(new { message = "Plan application not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while deleting the plan application: {ex.Message}" });
            }
        }
    }
}