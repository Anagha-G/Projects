using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class InternshipApplicationService{
        private readonly ApplicationDbContext _context;

        public InternshipApplicationService(ApplicationDbContext context){
            this._context = context;
        }

        public async Task<IEnumerable<InternshipApplication>> GetAllInternshipApplications(){
            var res = await _context.InternshipApplications
                        .Include(obj => obj.User)
                        .Include(obj => obj.Internship)
                        .ToListAsync();
            return res;
        }

        public async Task<IEnumerable<InternshipApplication>> GetInternshipApplicationsByUserId(int userId)
{
    var res = await _context.InternshipApplications
                .Where(obj => obj.UserId == userId)
                .Include(obj => obj.User)
                .Include(obj => obj.Internship)
                .ToListAsync();
    return res;
}

        public async Task<bool> AddInternshipApplication(InternshipApplication internshipApplication){
            var isAppliedByUser = await _context.InternshipApplications
                                    .AnyAsync(obj=> obj.UserId == internshipApplication.UserId && obj.InternshipId == internshipApplication.InternshipId);
            if(isAppliedByUser){
                throw new InternshipException("User already applied for this internship");
            }
            await _context.InternshipApplications.AddAsync(internshipApplication);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateInternshipApplication(int internshipApplicationId, InternshipApplication internshipApplication)
{
    var res = await _context.InternshipApplications.FindAsync(internshipApplicationId);
    if (res == null)
    {
        return false;
    }
 
    // Update each property individually to ensure correct mapping
    res.UserId = internshipApplication.UserId;
    res.InternshipId = internshipApplication.InternshipId;
    res.UniversityName = internshipApplication.UniversityName;
    res.DegreeProgram = internshipApplication.DegreeProgram;
    res.Resume = internshipApplication.Resume;
    res.LinkedInProfile = internshipApplication.LinkedInProfile;
    res.ApplicationStatus = internshipApplication.ApplicationStatus;
    res.ApplicationDate = internshipApplication.ApplicationDate;
 
    await _context.SaveChangesAsync();
    return true;
}
 

        public async Task<bool> DeleteInternshipApplication(int internshipApplicationId){
            var res = await _context.InternshipApplications.FindAsync(internshipApplicationId);
            if(res == null){
                return false;
            }
            var exist = await _context.InternshipApplications.AnyAsync(obj => obj.InternshipApplicationId == internshipApplicationId);
            if(!exist){
                throw new InternshipException("InternshipApplication cannot be deleted, it is referenced in internshipApplicationApplicationapplication");
            }
            _context.InternshipApplications.Remove(res);
            await _context.SaveChangesAsync();
            return true;
        }
        
    }
    
}