using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Controllers;
using Microsoft.AspNetCore.Identity;
using Application.Profiles.Dtos;
using Application.Accounts.Commands;
using Application.Accounts.commands;


namespace API.DTOs
{
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {

            var result = await Mediator.Send(
                new CreateUser.Command { Register = registerDto });

            if (result.Succeeded) return Ok();

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        [AllowAnonymous]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfor()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);

            return Ok(new
            {
                user?.DisplayName,
                user?.Email,
                user?.Id,
                user?.ImageUrl
            });

        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmail.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

    }

}