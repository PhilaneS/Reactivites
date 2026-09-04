using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _mediator = null!;

    protected IMediator Mediator => 
    _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> result )
    {
        if(!result.IsSuccess && result.Code ==404) return NotFound();
        
        if(result.IsSuccess && result.Data is not null) return Ok(result.Data);

        return BadRequest(result.Error);
        
    }

}