using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Tests.CatalogTransfer;

public class CatalogTransferOperationTests
{
    [Fact]
    public void InitialStatus_IsPending()
    {
        var op = new CatalogTransferOperation();
        Assert.Equal(CatalogTransferStatus.Pending, op.Status);
    }

    [Fact]
    public void PendingOperation_CanTransition_ToRunning()
    {
        var op = new CatalogTransferOperation { Status = CatalogTransferStatus.Pending };
        Assert.True(IsValidTransition(CatalogTransferStatus.Pending, CatalogTransferStatus.Running));
    }

    [Fact]
    public void RunningOperation_CanTransition_ToCompleted()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Running, CatalogTransferStatus.Completed));
    }

    [Fact]
    public void RunningOperation_CanTransition_ToFailed()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Running, CatalogTransferStatus.Failed));
    }

    [Fact]
    public void RunningOperation_CanTransition_ToCancelling()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Running, CatalogTransferStatus.Cancelling));
    }

    [Fact]
    public void CancellingOperation_CanTransition_ToCancelled()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Cancelling, CatalogTransferStatus.Cancelled));
    }

    [Fact]
    public void ValidatingOperation_CanTransition_ToRunning()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Validating, CatalogTransferStatus.Running));
    }

    [Fact]
    public void ValidatingOperation_CanTransition_ToFailed()
    {
        Assert.True(IsValidTransition(CatalogTransferStatus.Validating, CatalogTransferStatus.Failed));
    }

    [Fact]
    public void InterruptedOperation_IsTerminal()
    {
        Assert.True(IsTerminal(CatalogTransferStatus.Interrupted));
    }

    [Fact]
    public void CompletedOperation_IsTerminal()
    {
        Assert.True(IsTerminal(CatalogTransferStatus.Completed));
    }

    [Fact]
    public void CancelledOperation_IsTerminal()
    {
        Assert.True(IsTerminal(CatalogTransferStatus.Cancelled));
    }

    [Fact]
    public void FailedOperation_IsTerminal()
    {
        Assert.True(IsTerminal(CatalogTransferStatus.Failed));
    }

    [Fact]
    public void TerminalOperations_CannotTransition()
    {
        foreach (var terminal in TerminalStatuses())
        {
            foreach (var target in Enum.GetValues<CatalogTransferStatus>())
            {
                if (terminal != target)
                    Assert.False(IsValidTransition(terminal, target), $"Terminal {terminal} should not transition to {target}");
            }
        }
    }

    [Fact]
    public void NonTerminalStatus_HoldsLease()
    {
        Assert.True(HoldsLease(CatalogTransferStatus.Pending));
        Assert.True(HoldsLease(CatalogTransferStatus.Validating));
        Assert.True(HoldsLease(CatalogTransferStatus.Running));
        Assert.True(HoldsLease(CatalogTransferStatus.Cancelling));
    }

    [Fact]
    public void TerminalStatus_DoesNotHoldLease()
    {
        Assert.False(HoldsLease(CatalogTransferStatus.Completed));
        Assert.False(HoldsLease(CatalogTransferStatus.Failed));
        Assert.False(HoldsLease(CatalogTransferStatus.Cancelled));
        Assert.False(HoldsLease(CatalogTransferStatus.Interrupted));
    }

    [Fact]
    public void Kind_IsExport_Or_Import()
    {
        var kinds = Enum.GetValues<CatalogTransferKind>();
        Assert.Equal(2, kinds.Length);
        Assert.Contains(CatalogTransferKind.Export, kinds);
        Assert.Contains(CatalogTransferKind.Import, kinds);
    }

    [Fact]
    public void Phase_AllValues_AreDefined()
    {
        var phases = Enum.GetValues<CatalogTransferPhase>();
        Assert.Contains(CatalogTransferPhase.AcquireLease, phases);
        Assert.Contains(CatalogTransferPhase.Snapshot, phases);
        Assert.Contains(CatalogTransferPhase.Package, phases);
        Assert.Contains(CatalogTransferPhase.Verify, phases);
        Assert.Contains(CatalogTransferPhase.StageImages, phases);
        Assert.Contains(CatalogTransferPhase.RestoreCatalog, phases);
        Assert.Contains(CatalogTransferPhase.Finalize, phases);
        Assert.Contains(CatalogTransferPhase.Cleanup, phases);
        Assert.Contains(CatalogTransferPhase.Report, phases);
    }

    [Fact]
    public void Operation_HasExpectedDefaults()
    {
        var op = new CatalogTransferOperation();
        Assert.Equal(0L, op.TotalRecords);
        Assert.Equal(0L, op.ProcessedRecords);
        Assert.Equal(0L, op.TotalImages);
        Assert.Equal(0L, op.ProcessedImages);
        Assert.Equal(0L, op.TotalImageBytes);
        Assert.Equal(0L, op.ProcessedImageBytes);
        Assert.Equal(0, op.ErrorCount);
        Assert.Equal(0, op.WarningCount);
        Assert.Null(op.ValidationSucceeded);
        Assert.Null(op.PackageId);
        Assert.Null(op.FormatVersion);
    }

    private static bool IsValidTransition(CatalogTransferStatus from, CatalogTransferStatus to)
    {
        return from switch
        {
            CatalogTransferStatus.Pending => to is CatalogTransferStatus.Running or CatalogTransferStatus.Validating or CatalogTransferStatus.Failed or CatalogTransferStatus.Cancelled,
            CatalogTransferStatus.Validating => to is CatalogTransferStatus.Running or CatalogTransferStatus.Failed or CatalogTransferStatus.Cancelling,
            CatalogTransferStatus.Running => to is CatalogTransferStatus.Completed or CatalogTransferStatus.Failed or CatalogTransferStatus.Cancelling,
            CatalogTransferStatus.Cancelling => to is CatalogTransferStatus.Cancelled or CatalogTransferStatus.Failed,
            _ => false,
        };
    }

    private static bool IsTerminal(CatalogTransferStatus status)
    {
        return status is CatalogTransferStatus.Completed or CatalogTransferStatus.Failed
            or CatalogTransferStatus.Cancelled or CatalogTransferStatus.Interrupted;
    }

    private static IEnumerable<CatalogTransferStatus> TerminalStatuses()
    {
        return Enum.GetValues<CatalogTransferStatus>().Where(IsTerminal);
    }

    private static bool HoldsLease(CatalogTransferStatus status)
    {
        return status is CatalogTransferStatus.Pending or CatalogTransferStatus.Validating
            or CatalogTransferStatus.Running or CatalogTransferStatus.Cancelling;
    }
}
