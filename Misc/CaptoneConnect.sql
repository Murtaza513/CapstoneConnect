USE [CapstoneConnect]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 4/4/2024 11:17:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Administrator]    Script Date: 4/4/2024 11:17:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Administrator](
	[Id] [varchar](10) NOT NULL,
	[Username] [varchar](max) NOT NULL,
	[OfficeNo] [varchar](max) NOT NULL,
	[Email] [varchar](max) NOT NULL,
	[Joindate] [varchar](max) NOT NULL,
 CONSTRAINT [PK_Administrator] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](450) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FypGroup]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FypGroup](
	[Id] [varchar](10) NOT NULL,
	[Title] [varchar](max) NOT NULL,
	[Supervisor_Id] [varchar](max) NOT NULL,
	[Cosupervisor_Id] [varchar](max) NOT NULL,
	[Teamlead] [varchar](max) NOT NULL,
	[Member1] [varchar](max) NOT NULL,
	[Member2] [varchar](max) NULL,
	[Member3] [varchar](max) NULL,
	[Year] [varchar](max) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[CompletionDate] [date] NULL,
 CONSTRAINT [PK_FypGroup] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Meetings]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Meetings](
	[Id] [varchar](10) NOT NULL,
	[Agenda] [varchar](max) NOT NULL,
	[Time] [varchar](max) NOT NULL,
	[GroupId] [varchar](max) NOT NULL,
	[Status] [varchar](max) NOT NULL,
 CONSTRAINT [PK_Meetings] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[Id] [varchar](10) NOT NULL,
	[Title] [varchar](max) NOT NULL,
	[Details] [varchar](max) NOT NULL,
	[Deadline] [date] NOT NULL,
	[Semester] [tinyint] NOT NULL,
 CONSTRAINT [PK_Notification] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Proposal]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Proposal](
	[Id] [varchar](10) NOT NULL,
	[Title] [varchar](max) NOT NULL,
	[Supervisor] [varchar](max) NOT NULL,
	[Teamlead] [varchar](max) NOT NULL,
	[Teamlead_Id] [varchar](10) NOT NULL,
	[Member1] [varchar](max) NOT NULL,
	[Member1_Id] [varchar](10) NOT NULL,
	[Member2] [varchar](max) NOT NULL,
	[Member2_Id] [varchar](10) NOT NULL,
	[Member3] [varchar](max) NULL,
	[Member3_Id] [varchar](10) NULL,
	[Project_Description] [varchar](max) NOT NULL,
	[Tags] [varchar](max) NOT NULL,
	[Response] [varchar](max) NULL,
	[Feedback] [varchar](max) NULL,
	[Doc] [varchar](max) NULL,
 CONSTRAINT [PK_Proposal] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[Id] [varchar](10) NOT NULL,
	[Name] [varchar](max) NOT NULL,
	[Department] [varchar](max) NOT NULL,
	[CGPA] [float] NOT NULL,
	[Completed_Credit_Hour] [int] NOT NULL,
	[Semester] [int] NOT NULL,
	[Email] [varchar](max) NOT NULL,
	[Contact] [bigint] NOT NULL,
	[EnrollmentDate] [date] NOT NULL,
 CONSTRAINT [PK_Students] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Submission]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Submission](
	[Id] [varchar](10) NOT NULL,
	[Type] [varchar](max) NOT NULL,
	[Time] [timestamp] NOT NULL,
	[Fyp_GrpID] [varchar](max) NOT NULL,
	[status] [tinyint] NOT NULL,
	[Feedback] [varchar](max) NOT NULL,
	[Grade] [float] NOT NULL,
 CONSTRAINT [PK_Submission] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Supervisor]    Script Date: 4/4/2024 11:17:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supervisor](
	[Id] [varchar](10) NOT NULL,
	[Name] [varchar](max) NOT NULL,
	[Available_Slots] [int] NOT NULL,
	[FYP_Preferences] [varchar](max) NULL,
	[Department] [varchar](max) NOT NULL,
	[Email] [varchar](max) NOT NULL,
 CONSTRAINT [PK_Supervisor] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240228213721_IdentityDBUser2', N'6.0.27')
GO
INSERT [dbo].[Administrator] ([Id], [Username], [OfficeNo], [Email], [Joindate]) VALUES (N'A800', N'Saad Luqman', N'145', N'saadluqman@gmail.com', N'12-12-2015')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'58b91a25-196e-4902-ad9e-b2bb3accdf1b', N'Supervisor', N'SUPERVISOR', N'ceba4eff-595a-440f-a299-1144029b7fbc')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'5ccea996-65e8-424b-a3e1-9126d0859b66', N'Admin', N'ADMIN', N'0d264bd1-033f-46e8-a532-06d6979a9e21')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'8faad514-6490-4d62-a668-9ddbf7d915ed', N'Student', N'STUDENT', N'd99c891d-d636-4780-9c6c-a52d0e262ab9')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'9dfb88ed-1f14-461b-84b3-0d5d934792b1', N'58b91a25-196e-4902-ad9e-b2bb3accdf1b')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'fb35a02f-2f99-4617-9ea1-46007dadef48', N'58b91a25-196e-4902-ad9e-b2bb3accdf1b')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'8937f86c-8aba-4cd3-b960-0361538926cb', N'5ccea996-65e8-424b-a3e1-9126d0859b66')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'c900f859-f072-4ac7-bd75-bab88a670e22', N'5ccea996-65e8-424b-a3e1-9126d0859b66')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'08194bb8-777b-4615-88c4-652efe439bff', N'8faad514-6490-4d62-a668-9ddbf7d915ed')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'113dc91f-3154-4441-a85f-1bc2cbf43549', N'8faad514-6490-4d62-a668-9ddbf7d915ed')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'86fdaa6a-f4a3-4269-88c2-6f0881f3ef82', N'8faad514-6490-4d62-a668-9ddbf7d915ed')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'a458165d-b373-4af2-bf6e-25d30acfa146', N'8faad514-6490-4d62-a668-9ddbf7d915ed')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'ca4ab1fd-6dc8-4108-b87d-5df8f438ad55', N'8faad514-6490-4d62-a668-9ddbf7d915ed')
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'08194bb8-777b-4615-88c4-652efe439bff', N'Ayushmannnn', N'AYUSHMANNNN', N'ayush@gmail.com', N'AYUSH@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEFK9Hpaz365YU9mZbfRzoIDs/rc9HEy3wsKnnf7xgzG0amk3GNMNlMDE4+7oaARVVQ==', N'2G2FAKWCBHC4L2WDDVCOK6TUOXSNVGF6', N'3cf24e1c-a8bc-4f92-98cc-dc8aa3e45911', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'113dc91f-3154-4441-a85f-1bc2cbf43549', N'MurtazaMehdi', N'MURTAZAMEHDI', N'mehdi@gmail.com', N'MEHDI@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEMbbtwWgjieovYRixUlgdO94pi9uEEylNO/5P/www5ycDd5F2iEzObGUelzPOKFKPA==', N'B4NVTNUWOVPW7VBYNGUO736TJBNAISJZ', N'505d648d-59f4-4887-88c9-087f1205d471', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'86fdaa6a-f4a3-4269-88c2-6f0881f3ef82', N'Ayushmann', N'AYUSHMANN', N'ayush@gmail.com', N'AYUSH@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEA0LyYLxoa6MFDW7H0SkvHsA3Nw6P6FhbMxAUXG823H11WrRnECeb3kiy5NpNbHbMw==', N'UYCD7YATUYIB54BLDCZTXMZRZPHDQHXE', N'89d99263-9d54-43e7-bb6b-20184a2e2206', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'8937f86c-8aba-4cd3-b960-0361538926cb', N'SaadLuqaman', N'SAADLUQAMAN', N'saad@gmail.com', N'SAAD@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEP5BwrhobS0getcVJ/tVkO5txwFjWHjVRoRYJUjFyV7U6eGl00C/bUD7aYAy0ftJeA==', N'SEWPVQ64ZZIZIX65QY5MVVMJHHHFMK5W', N'19ce8f32-5664-4d5b-acb6-c066490730f9', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'9dfb88ed-1f14-461b-84b3-0d5d934792b1', N'supervisor@gmail.com', N'SUPERVISOR@GMAIL.COM', N'supervisor@gmail.com', N'SUPERVISOR@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEBGgh/JzyAtCWRSYawWqrn49LUZ/yIvIPpzMXq4TZlwI2LaqUexNWT8+pFX5i8uMmQ==', N'RXGSUAPSVCW26DTWIB7BYEIQQRQG5ORE', N'dab257d0-c113-4091-94e6-334dc8ca73e1', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'a458165d-b373-4af2-bf6e-25d30acfa146', N'Ark', N'ARK', N'ark@gmail.com', N'ARK@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEIxvLe2bSQIkf0NECl/ObL1Nqa/7wji1cHOBRwNoXBRZIKemG7zKSEnwYEiUHO/iEw==', N'IWWWCEHJYHHEPX33PIKJHX6KG4FFXIZN', N'5e0c48a1-5abb-4b72-91e4-bb31f8432102', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'c900f859-f072-4ac7-bd75-bab88a670e22', N'admin@gmail.com', N'ADMIN@GMAIL.COM', N'admin@gmail.com', N'ADMIN@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEDcJ51mZlGBGJoDscTJFMAw/63hdakj0bmcWvUhnhx3rubknMVdykNU2XExaNoIKOA==', N'T5RBEWTQ3LECJT6XR4IRY4FRKHG25FLF', N'0b0955d2-221e-427f-b14e-87036e0d4e58', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'ca4ab1fd-6dc8-4108-b87d-5df8f438ad55', N'student@gmail.com', N'STUDENT@GMAIL.COM', N'student@gmail.com', N'STUDENT@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAED5TqvEQJCexW6iGgcOinjYDysTuuBQL/n8KcfxGfrWBIvUuajevqoncU5eliusx1Q==', N'O7PGYL2LB5ISBJNIUERSCWNNTYFA4CT7', N'3f8b888b-7900-4a95-8565-df23e7c198f7', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'fb35a02f-2f99-4617-9ea1-46007dadef48', N'UroojWaheed', N'UROOJWAHEED', N'Urooj@gmail.com', N'UROOJ@GMAIL.COM', 0, N'AQAAAAEAACcQAAAAEF3+VMzcnMX1X5jnOtGtI5oiW6M2wc6K1/hZ/RmVxit4gMTKUfsPfKmeWkLjDmB++A==', N'I7ZRZKZNQIKL3CIKAR5HGVE6TMHW7JKW', N'6437b3d3-134a-4133-883f-f03c4d219dc8', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[Proposal] ([Id], [Title], [Supervisor], [Teamlead], [Teamlead_Id], [Member1], [Member1_Id], [Member2], [Member2_Id], [Member3], [Member3_Id], [Project_Description], [Tags], [Response], [Feedback], [Doc]) VALUES (N'P-2067', N'Capstone Connect', N'Urooj Waheed', N'Ayushmann Kukreja', N'cs201245', N'Murtaza Mehdi', N'cs201211', N'Abdul Rehman Khan', N'cs201250', NULL, NULL, N'CapstoneConnect aims to enhance the Final Year Project (FYP) experience by providing a user-friendly portal with streamlined communication and robust project management features. ', N'MVC, DOT.NET CORE, WEB APP, PORTAL', N'Pending', NULL, NULL)
GO
INSERT [dbo].[Students] ([Id], [Name], [Department], [CGPA], [Completed_Credit_Hour], [Semester], [Email], [Contact], [EnrollmentDate]) VALUES (N'CS201245', N'Ayushmann Kukreja', N'Computer Science', 3.39, 113, 7, N'ayushmann5077@gmail.com', 3122543884, CAST(N'2020-10-01' AS Date))
GO
INSERT [dbo].[Supervisor] ([Id], [Name], [Available_Slots], [FYP_Preferences], [Department], [Email]) VALUES (N'CS700', N'Urooj Waheed', 3, N'Web/App', N'Computer Science', N'uroojwaheed@dsu.pk')
GO
ALTER TABLE [dbo].[AspNetRoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetRoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
