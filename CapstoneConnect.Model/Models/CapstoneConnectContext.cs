using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CapstoneConnectDatabase.Models
{
    public partial class CapstoneConnectContext : DbContext
    {
        public CapstoneConnectContext()
        {
        }

        public CapstoneConnectContext(DbContextOptions<CapstoneConnectContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Administrator> Administrators { get; set; } = null!;
        public virtual DbSet<Alumnus> Alumni { get; set; } = null!;
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; } = null!;
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; } = null!;
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; } = null!;
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; } = null!;
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; } = null!;
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; } = null!;
        public virtual DbSet<Calendar> Calendars { get; set; } = null!;
        public virtual DbSet<Conversation> Conversations { get; set; } = null!;
        public virtual DbSet<FinalEvaluation> FinalEvaluations { get; set; } = null!;
        public virtual DbSet<FypGroup> FypGroups { get; set; } = null!;
        public virtual DbSet<Guideline> Guidelines { get; set; } = null!;
        public virtual DbSet<Log> Logs { get; set; } = null!;
        public virtual DbSet<Meeting> Meetings { get; set; } = null!;
        public virtual DbSet<Message> Messages { get; set; } = null!;
        public virtual DbSet<MidEvaluation> MidEvaluations { get; set; } = null!;
        public virtual DbSet<Notification> Notifications { get; set; } = null!;
        public virtual DbSet<Participant> Participants { get; set; } = null!;
        public virtual DbSet<Plagiarism> Plagiarisms { get; set; } = null!;
        public virtual DbSet<ProjectRepositry> ProjectRepositries { get; set; } = null!;
        public virtual DbSet<ProposalDefence> ProposalDefences { get; set; } = null!;
        public virtual DbSet<Query> Queries { get; set; } = null!;
        public virtual DbSet<RegistrationHistory> RegistrationHistories { get; set; } = null!;
        public virtual DbSet<Rule> Rules { get; set; } = null!;
        public virtual DbSet<Student> Students { get; set; } = null!;
        public virtual DbSet<Submission> Submissions { get; set; } = null!;
        public virtual DbSet<SubmissionRepositry> SubmissionRepositries { get; set; } = null!;
        public virtual DbSet<SubmissionStatus> SubmissionStatuses { get; set; } = null!;
        public virtual DbSet<SubmissionType> SubmissionTypes { get; set; } = null!;
        public virtual DbSet<Supervisor> Supervisors { get; set; } = null!;
        public virtual DbSet<WorkItem> WorkItems { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=tcp:capstoneconnectserver.database.windows.net,1433;Initial Catalog=CapstoneConnect;Persist Security Info=False;User ID=capstoneconnect;Password=Suicidesquad1;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Administrator>(entity =>
            {
                entity.ToTable("Administrator");

                entity.Property(e => e.Id)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.Joindate).IsUnicode(false);

                entity.Property(e => e.OfficeNo).IsUnicode(false);

                entity.Property(e => e.Username).IsUnicode(false);
            });

            modelBuilder.Entity<Alumnus>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Department).IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.FinalEvaluationGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Id)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Name).IsUnicode(false);
            });

            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasMany(d => d.Roles)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "AspNetUserRole",
                        l => l.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                        r => r.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_AspNetUserRoles_AspNetUsers"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId");

                            j.ToTable("AspNetUserRoles");

                            j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                        });
            });

            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<Calendar>(entity =>
            {
                entity.ToTable("Calendar");

                entity.Property(e => e.Deadline).HasColumnType("date");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Section)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<FinalEvaluation>(entity =>
            {
                entity.ToTable("FinalEvaluation");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ExternalJury).IsUnicode(false);

                entity.Property(e => e.InternalJury).IsUnicode(false);

                entity.Property(e => e.Remarks).IsUnicode(false);
            });

            modelBuilder.Entity<FypGroup>(entity =>
            {
                entity.ToTable("FypGroup");

                entity.Property(e => e.CompletionDate).HasColumnType("date");

                entity.Property(e => e.CosupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("Cosupervisor_Id");

                entity.Property(e => e.FinalGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.FypYear).HasDefaultValueSql("((2024))");

                entity.Property(e => e.MidGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Progress).HasDefaultValueSql("((0))");

                entity.Property(e => e.ProjectDescription).IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Pending')");

                entity.Property(e => e.SupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("Supervisor_Id");

                entity.Property(e => e.Tags).IsUnicode(false);

                entity.Property(e => e.TeamleadId)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Title).IsUnicode(false);

                entity.HasOne(d => d.Cosupervisor)
                    .WithMany(p => p.FypGroupCosupervisors)
                    .HasForeignKey(d => d.CosupervisorId)
                    .HasConstraintName("FK_FypGroup_Supervisor1");

                entity.HasOne(d => d.Supervisor)
                    .WithMany(p => p.FypGroupSupervisors)
                    .HasForeignKey(d => d.SupervisorId)
                    .HasConstraintName("FK_FypGroup_Supervisor");

                entity.HasOne(d => d.Teamlead)
                    .WithMany(p => p.FypGroups)
                    .HasForeignKey(d => d.TeamleadId)
                    .HasConstraintName("FK_FypGroup_Students");
            });

            modelBuilder.Entity<Guideline>(entity =>
            {
                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Section)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.TemplatePath).IsUnicode(false);

                entity.HasOne(d => d.Submission)
                    .WithMany(p => p.Guidelines)
                    .HasForeignKey(d => d.SubmissionId)
                    .HasConstraintName("FK_Guidelines_SubmissionType");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.ToTable("Log");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Exception).HasMaxLength(2000);

                entity.Property(e => e.InnerException).HasMaxLength(2000);

                entity.Property(e => e.InnerTrace).HasMaxLength(4000);

                entity.Property(e => e.Level).HasMaxLength(50);

                entity.Property(e => e.Logger).HasMaxLength(255);

                entity.Property(e => e.Message).HasMaxLength(4000);

                entity.Property(e => e.Thread).HasMaxLength(255);

                entity.Property(e => e.Trace).HasMaxLength(4000);
            });

            modelBuilder.Entity<Meeting>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Agenda).IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Feedback).IsUnicode(false);

                entity.Property(e => e.ListOfParticipants).IsUnicode(false);

                entity.Property(e => e.Location).IsUnicode(false);

                entity.HasOne(d => d.Fyp)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.FypId)
                    .HasConstraintName("FK_Meetings_FypGroup");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.MessageContent).IsUnicode(false);

                entity.Property(e => e.MessageDate)
                    .HasColumnType("date")
                    .HasDefaultValueSql("(CONVERT([date],getdate()))");

                entity.Property(e => e.MessageTime).HasDefaultValueSql("(CONVERT([time],getdate()))");

                entity.Property(e => e.ReceiverId)
                    .HasMaxLength(45)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.SenderId)
                    .HasMaxLength(45)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.Conversation)
                    .WithMany(p => p.Messages)
                    .HasForeignKey(d => d.ConversationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Messages_Conversations");
            });

            modelBuilder.Entity<MidEvaluation>(entity =>
            {
                entity.ToTable("MidEvaluation");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Date).HasColumnType("date");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Role).HasMaxLength(50);

                entity.Property(e => e.Title).HasMaxLength(255);

                entity.Property(e => e.UserId).HasMaxLength(450);
            });

            modelBuilder.Entity<Participant>(entity =>
            {
                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.Conversation)
                    .WithMany(p => p.Participants)
                    .HasForeignKey(d => d.ConversationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Participants_Conversations");
            });

            modelBuilder.Entity<Plagiarism>(entity =>
            {
                entity.ToTable("Plagiarism");

                entity.Property(e => e.PlagiarismPercentage).HasColumnType("decimal(5, 2)");

                entity.HasOne(d => d.MatchedFyp)
                    .WithMany(p => p.Plagiarisms)
                    .HasForeignKey(d => d.MatchedFypId)
                    .HasConstraintName("FK__Plagiaris__Match__3D2915A8");

                entity.HasOne(d => d.Submission)
                    .WithMany(p => p.Plagiarisms)
                    .HasForeignKey(d => d.SubmissionId)
                    .HasConstraintName("FK__Plagiaris__Submi__3C34F16F");
            });

            modelBuilder.Entity<ProjectRepositry>(entity =>
            {
                entity.HasKey(e => e.FypId);

                entity.ToTable("ProjectRepositry");

                entity.Property(e => e.FypId).ValueGeneratedNever();

                entity.Property(e => e.CoSupervisorRank)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.CosupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("Cosupervisor_Id");

                entity.Property(e => e.Grade)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Inspiration).IsUnicode(false);

                entity.Property(e => e.ProjectDescription).IsUnicode(false);

                entity.Property(e => e.SupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("Supervisor_Id");

                entity.Property(e => e.SupervisorRank)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Tags).IsUnicode(false);

                entity.Property(e => e.TeamleadId)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Title).IsUnicode(false);

                entity.HasOne(d => d.Cosupervisor)
                    .WithMany(p => p.ProjectRepositryCosupervisors)
                    .HasForeignKey(d => d.CosupervisorId)
                    .HasConstraintName("FK_ProjectRepositry_Supervisor");

                entity.HasOne(d => d.Supervisor)
                    .WithMany(p => p.ProjectRepositrySupervisors)
                    .HasForeignKey(d => d.SupervisorId)
                    .HasConstraintName("FK_ProjectRepositry_ProjectRepositry");
            });

            modelBuilder.Entity<ProposalDefence>(entity =>
            {
                entity.ToTable("ProposalDefence");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ExternalJury).IsUnicode(false);

                entity.Property(e => e.InternalJury).IsUnicode(false);

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.Reponse)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Query>(entity =>
            {
                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");

                entity.Property(e => e.Count).HasDefaultValueSql("((0))");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.FypId).HasColumnName("FypID");

                entity.Property(e => e.Response).IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Pending')");

                entity.Property(e => e.Title).IsUnicode(false);

                entity.HasOne(d => d.Fyp)
                    .WithMany(p => p.Queries)
                    .HasForeignKey(d => d.FypId)
                    .HasConstraintName("FK_Queries_FypGroup");
            });

            modelBuilder.Entity<RegistrationHistory>(entity =>
            {
                entity.HasKey(e => e.FypId);

                entity.ToTable("RegistrationHistory");

                entity.Property(e => e.FypId).ValueGeneratedNever();

                entity.Property(e => e.Note).IsUnicode(false);

                entity.Property(e => e.TeamleadId)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Title).IsUnicode(false);
            });

            modelBuilder.Entity<Rule>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.MinimumCgpa).HasColumnName("MinimumCGPA");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Cgpa)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("CGPA");

                entity.Property(e => e.CompletedCreditHour).HasColumnName("Completed_Credit_Hour");

                entity.Property(e => e.Department).IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.EnrollmentDate).HasColumnType("date");

                entity.Property(e => e.FinalEvaluationGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.MidEvaluationGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Name).IsUnicode(false);

                entity.HasOne(d => d.Fyp)
                    .WithMany(p => p.Students)
                    .HasForeignKey(d => d.FypId)
                    .HasConstraintName("StudentFYPIDD_FypGroupId");
            });

            modelBuilder.Entity<Submission>(entity =>
            {
                entity.ToTable("Submission");

                entity.Property(e => e.CoSupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("CoSupervisorID");

                entity.Property(e => e.DocumentPath).IsUnicode(false);

                entity.Property(e => e.Feedback).IsUnicode(false);

                entity.Property(e => e.FypGrpId).HasColumnName("Fyp_GrpID");

                entity.Property(e => e.IsPlagiarised).HasDefaultValueSql("((0))");

                entity.Property(e => e.Status)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("status")
                    .HasDefaultValueSql("((3))")
                    .IsFixedLength();

                entity.Property(e => e.StudentId)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.SupervisorId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("SupervisorID");

                entity.Property(e => e.Time).HasColumnType("date");

                entity.HasOne(d => d.FypGrp)
                    .WithMany(p => p.Submissions)
                    .HasForeignKey(d => d.FypGrpId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Submission_FypGroup");

                entity.HasOne(d => d.StatusNavigation)
                    .WithMany(p => p.Submissions)
                    .HasForeignKey(d => d.Status)
                    .HasConstraintName("FK_Submission_SubmissionStatus");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.Submissions)
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_Submission_Students");

                entity.HasOne(d => d.TypeNavigation)
                    .WithMany(p => p.Submissions)
                    .HasForeignKey(d => d.Type)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Submission_SubmissionType");
            });

            modelBuilder.Entity<SubmissionRepositry>(entity =>
            {
                entity.ToTable("SubmissionRepositry");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.DocumentPath).IsUnicode(false);

                entity.Property(e => e.FypGrpId).HasColumnName("Fyp_GrpId");

                entity.HasOne(d => d.FypGrp)
                    .WithMany(p => p.SubmissionRepositries)
                    .HasForeignKey(d => d.FypGrpId)
                    .HasConstraintName("FK_SubmissionRepositry_ProjectRepositry");
            });

            modelBuilder.Entity<SubmissionStatus>(entity =>
            {
                entity.HasKey(e => e.StatusNumber)
                    .HasName("PK_SubmissionStatus_1");

                entity.ToTable("SubmissionStatus");

                entity.Property(e => e.StatusNumber)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Status)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SubmissionType>(entity =>
            {
                entity.HasKey(e => e.SubmissionId);

                entity.ToTable("SubmissionType");

                entity.Property(e => e.SubmissionName).IsUnicode(false);

                entity.Property(e => e.SubmissionType1)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("SubmissionType");
            });

            modelBuilder.Entity<Supervisor>(entity =>
            {
                entity.ToTable("Supervisor");

                entity.Property(e => e.Id)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.AdminRank)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.AvailableSlots).HasDefaultValueSql("((5))");

                entity.Property(e => e.AvgGrade)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.AvgRank)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Department).IsUnicode(false);

                entity.Property(e => e.Fyppreferences)
                    .IsUnicode(false)
                    .HasColumnName("FYPPreferences");

                entity.Property(e => e.Username).IsUnicode(false);
            });

            modelBuilder.Entity<WorkItem>(entity =>
            {
                entity.Property(e => e.AssignedOn)
                    .HasColumnType("date")
                    .HasColumnName("Assigned_On");

                entity.Property(e => e.AssignedTo)
                    .IsUnicode(false)
                    .HasColumnName("Assigned_To");

                entity.Property(e => e.CreatedBy)
                    .IsUnicode(false)
                    .HasColumnName("Created_By");

                entity.Property(e => e.Deadline).HasColumnType("date");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Feedback).IsUnicode(false);

                entity.Property(e => e.FypId).HasColumnName("FYP_Id");

                entity.Property(e => e.Status)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('ToDo')");

                entity.Property(e => e.Title).IsUnicode(false);

                entity.HasOne(d => d.Fyp)
                    .WithMany(p => p.WorkItems)
                    .HasForeignKey(d => d.FypId)
                    .HasConstraintName("FK_WorkItems_FypGroup");
            });

            modelBuilder.HasSequence("FypGroupIdSequence").StartsAt(2067);

            modelBuilder.HasSequence("IncrementSequence").StartsAt(2068);

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
