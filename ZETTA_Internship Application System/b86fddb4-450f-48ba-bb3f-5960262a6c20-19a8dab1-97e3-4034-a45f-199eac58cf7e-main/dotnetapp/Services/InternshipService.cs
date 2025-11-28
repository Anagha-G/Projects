using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class InternshipService {
        private readonly ApplicationDbContext _context;

        public InternshipService(ApplicationDbContext context){
            this._context = context;
        }

        public async Task<IEnumerable<Internship>> GetAllInternships(){
            var res = await _context.Internships.ToListAsync();
            return res;
        }

        public async Task<Internship> GetInternshipById(int internshipId){
            var res = await _context.Internships.FindAsync(internshipId);
            return res;
        }

        public async Task<bool> AddInternship(Internship internship){
            var res = await _context.Internships.FirstOrDefaultAsync(obj=> obj.CompanyName.Equals(internship.CompanyName));
            if(res != null){
                throw new InternshipException("Company with the same name already exists");
            }
            await _context.Internships.AddAsync(internship);
            await _context.SaveChangesAsync();
            return true;
        }
 
        public async Task<bool> UpdateInternship(int internshipId, Internship internship)
{
    var res = await _context.Internships.FindAsync(internshipId);
    if (res == null)
    {
        return false;
    }
    var duplicateInternship = await _context.Internships
        .FirstOrDefaultAsync(obj => obj.CompanyName.Equals(internship.CompanyName) && obj.InternshipId != internshipId);
    if (duplicateInternship != null)
    {
        throw new InternshipException("Company with the same name already exists");
    }
 
    res.Title = internship.Title;
    res.CompanyName = internship.CompanyName;
    res.Location = internship.Location;
    res.DurationInMonths = internship.DurationInMonths;
    res.Stipend = internship.Stipend;
    res.Description = internship.Description;
    res.SkillsRequired = internship.SkillsRequired;
    res.ApplicationDeadline = internship.ApplicationDeadline;
 
    await _context.SaveChangesAsync();
    return true;
}
 
        public async Task<bool> DeleteInternship(int internshipId){
            var res = await _context.Internships.FindAsync(internshipId);
            if(res == null){
                return false;
            }
            var exist = await _context.InternshipApplications.FirstOrDefaultAsync(obj => obj.InternshipId == internshipId);
            if(exist != null){
                throw new InternshipException("Internship cannot be deleted, it is referenced in internshipapplication");
            }
            _context.Internships.Remove(res);
            await _context.SaveChangesAsync();
            return true;
        }
        
    }
    
}