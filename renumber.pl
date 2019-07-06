use strict;
#use warnings;


sub openFile {
  #0 = filename
  my $fn = $_[0];
  my @lines = ();
  open(my $fh, '<:encoding(UTF-8)', $fn)
    or die("could not open $fn\n");
  while (my $row = <$fh>) {
    chomp $row;
    push @lines, $row;
  }
  return @lines;
}

sub processArray {
  #0 = Array
  my @arr = @{$_[0]};
  my $arrlen = 0+@arr;
  my @oarr = @arr;
  my $matchLeftToken = qr/(^\<\w+\>)/;
  my $matchOtherToken = qr/(\<\w+\>$)/;
  my $leftToken = undef;
  my $otherToken = undef;
  for my $i (0 .. $arrlen) {
    if (@arr[$i] =~ $matchLeftToken) {
      $leftToken = $1;
    }
    if (@arr[$i] =~ $matchOtherToken) {
      $otherToken = $1;
    }
    my %tokObj = createTokObj($i, $leftToken, $otherToken);
    $leftToken = undef;
    $otherToken = undef;
    @arr = processTokenObj(\@arr, \%tokObj, $i, \@oarr);
  }
  return @arr;
}

sub createTokObj {
  #0 = lnr
  #1 = leftTok
  #2 = otherTok
  my $lnr = $_[0];
  my $leftTok = $_[1];
  my $otherTok = $_[2];
  my %tokObj;
  $tokObj{'lnr'} = $lnr;
  if ($leftTok) { $tokObj{'leftTok'} = $leftTok; }
  if ($otherTok) { $tokObj{'otherTok'} = $otherTok; }
  if (keys %tokObj == 1) { undef %tokObj; }
  return %tokObj;
}

sub processTokenObj {
  #0 = arr
  #1 = tokObj
  #2 = ln
  #3 = oarr
  my @arr = @{$_[0]};
  my $tokObj = $_[1];
  my $ln = $_[2];
  my @oarr = @{$_[3]};
  
  my $lnr = $tokObj->{'lnr'};
  my $leftTok = $tokObj->{'leftTok'};
  my $otherTok = $tokObj->{'otherTok'};

  if ($leftTok && !$otherTok) {
    @arr[$lnr] =~ s/$leftTok/$lnr/g;
  } elsif ($leftTok && $otherTok) {
    my $ol = findOtherLineNumber($otherTok, \@oarr);
    @arr[$lnr] =~ s/$leftTok/$lnr/g;
    @arr[$lnr] =~ s/$otherTok/$ol/g;
  } elsif ($otherTok && !$leftTok) {
    my $ol = findOtherLineNumber($otherTok, \@oarr);
    @arr[$lnr] =~ s/$otherTok/$ol/g;
    @arr[$lnr] = $lnr . ' ' . @arr[$lnr];
  } elsif (!$leftTok && !$otherTok) {
    @arr[$ln] = $ln . ' ' . @arr[$ln];
  }
  return @arr;
}

sub findOtherLineNumber {
  #1 = tok
  #2 = oarr
  my $tok = $_[0];
  my @oarr = @{$_[1]};
  my $oarrlen = 0+@oarr;
  my $matchThis = qr/^$tok+/;
  my $returnThis = undef;
  for my $i (0 .. $oarrlen) {
    $returnThis = $i;
    last if (@oarr[$i] =~ $matchThis);
  }
  return $returnThis;
}



if (!$ARGV[0]) {
  print "usage: $0 <basicProgram.bas>\n";
  exit;
}

my $filename = $ARGV[0];
my @lines = openFile($filename);
my @result = processArray(\@lines);
print join("\n", @result);
