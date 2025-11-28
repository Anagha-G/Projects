using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public class PlanApplicationService : IPlanApplicationService
    {
        private readonly ApplicationDbContext _context;

        public PlanApplicationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlanApplication>> GetAllPlanApplications()
        {
            return await _context.PlanApplications
                .Include(pa => pa.SavingsPlan)
                .Include(pa => pa.User)
                .ToListAsync();
        }

        public async Task<PlanApplication> GetPlanApplicationById(int planApplicationId)
        {
            return await _context.PlanApplications
                .Include(pa => pa.SavingsPlan)
                .Include(pa => pa.User)
                .FirstOrDefaultAsync(pa => pa.PlanApplicationId == planApplicationId);
        }

        public async Task<bool> AddPlanApplication(PlanApplication planApplication)
        {
            planApplication.Status = "Pending";
            _context.PlanApplications.Add(planApplication);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<PlanApplication>> GetPlanApplicationsByUserId(int userId)
        {
            return await _context.PlanApplications
                .Include(pa => pa.SavingsPlan)
                .Include(pa => pa.User)
                .Where(pa => pa.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> UpdatePlanApplication(int planApplicationId, PlanApplication planApplication)
        {
            var existingPlanApplication = await _context.PlanApplications.FindAsync(planApplicationId);
            if (existingPlanApplication == null)
            {
                return false;
            }

            _context.Entry(existingPlanApplication).CurrentValues.SetValues(planApplication);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletePlanApplication(int planApplicationId)
        {
            var planApplication = await _context.PlanApplications.FindAsync(planApplicationId);
            if (planApplication == null)
            {
                return false;
            }

            _context.PlanApplications.Remove(planApplication);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
