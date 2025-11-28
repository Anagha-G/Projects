using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly ApplicationDbContext db;

        public FeedbackService(ApplicationDbContext context)
        {
            db = context;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            return await db.Feedbacks.Include(f => f.User).ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await db.Feedbacks.Where(f => f.UserId == userId).Include(f => f.User).ToListAsync();
        }

        public async Task<bool> AddFeedback(Feedback feedback)
        {
            db.Feedbacks.Add(feedback);
            return await db.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteFeedback(int feedbackId)
        {
            var res = await db.Feedbacks.FindAsync(feedbackId);
            if (res == null) return false;

            db.Feedbacks.Remove(res);
            return await db.SaveChangesAsync() > 0;
        }
    }
}