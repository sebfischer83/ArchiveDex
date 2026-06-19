using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ArchiveDex.Web.Tests.Setup;

public class SetupWizardTests : TestContext
{
    public SetupWizardTests()
    {
        Services.AddArchiveDexLocalization();
        Services.AddSingleton(new HttpClient(new SetupStateHandler())
        {
            BaseAddress = new Uri("http://localhost")
        });
    }

    [Fact]
    public void SetupPage_Renders_WithoutError()
    {
        var cut = RenderComponent<Web.Components.Pages.Setup.Setup>();
        Assert.NotNull(cut.Markup);
    }

    [Fact]
    public void SetupPage_Contains_FormFields()
    {
        var cut = RenderComponent<Web.Components.Pages.Setup.Setup>();
        var markup = cut.Markup;

        Assert.Contains("Admin", markup);
        Assert.Contains("UI Language", markup);
        Assert.Contains("Currency", markup);
        Assert.Contains("Complete Setup", markup);
    }

    private sealed class SetupStateHandler : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new StringContent(
                    """{"isSetupComplete":false}""",
                    System.Text.Encoding.UTF8,
                    "application/json")
            };

            return Task.FromResult(response);
        }
    }
}
