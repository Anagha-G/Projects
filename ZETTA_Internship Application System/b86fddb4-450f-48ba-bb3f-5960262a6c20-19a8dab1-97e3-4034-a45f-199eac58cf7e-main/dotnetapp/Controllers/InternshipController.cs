using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;
using Microsoft.AspNetCore.Authorization;


namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InternshipController : ControllerBase
    {

           
        private readonly InternshipService _internshipService;

        public InternshipController(InternshipService internshipService)
        {
            _internshipService = internshipService;
        }


        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetAllInternships()
        {
            try
            {
                var internships = await _internshipService.GetAllInternships();
                return Ok(internships);
            }
            catch
            {
                return StatusCode(500, "Cannot retrieve internships.");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<Internship>> GetInternshipById(int id)
        {
            try
            {
                var internship = await _internshipService.GetInternshipById(id);
                if (internship == null)
                {
                    return NotFound(new {Message = "Cannot find any internship"});
                }
                return Ok(internship);
            }
            catch
            {
                return StatusCode(500, "Cannot retrieve internship.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddInternship([FromBody] Internship newInternship)
        {
            try
            {
                bool var = await _internshipService.AddInternship(newInternship);
                if(!var){
                    return BadRequest(new {Message = "Failed to add internship"});
                }
                return Ok(new {Message = "Internship added successfully"});
            }
            catch
            {
                return StatusCode(500, "Failed to add internship");
            }
        }

       [HttpPut("{id}")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> UpdateInternship(int id, [FromBody] Internship internship)
{
    try
    {
        var updated = await _internshipService.UpdateInternship(id, internship);
        if (!updated)
        {
            return NotFound(new { Message = "Cannot find any internship" });
        }
        return Ok(new { Message = "Internship updated successfully" });
    }
    catch (InternshipException ex)
    {
        return BadRequest(new { Message = ex.Message });
    }
    catch
    {
        return StatusCode(500, "Cannot update internship.");
    }
}
 

        [HttpDelete("{internshipId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteInternship(int internshipId)
        {
            try
            {
                var deleted = await _internshipService.DeleteInternship(internshipId);
                if (!deleted)
                {
                    return NotFound(new {Message = "Cannot find any internship"});
                }
                return Ok(new {Message = "Internship deleted successfully"});
            }
            catch(Exception e)
            {
                return StatusCode(500, $"Internal Server Error:{e.Message}");
            }
        }
   
        
    }
}