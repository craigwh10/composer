Feature: Getting conflicts of compose files

  Before:
    Given I start on the explorer page

  Scenario: I get conflict files back
    When I select a path with a compose file in range "5"
    Then I click search compose files
    Then I get paths to "15" compose files
    Then I "do" get some conflict yml back

  Scenario: I do not get conflict files back
    When I select a path with a compose file in range "2"
    Then I click search compose files
    Then I get paths to "7" compose files
    Then I "dont" get some conflict yml back
