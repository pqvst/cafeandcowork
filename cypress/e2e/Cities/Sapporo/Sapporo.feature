Feature: Sapporo
  # Completed Test
  Scenario: ユーザはpoool -Espresso&Work-の住所が確認できる
    Given ユーザはTOP画面に遷移する
    When TOP画面で「Sapporo」を選択する
    And Sapporo画面で「poool -Espresso&Work-」を選択する
    And ユーザはpoool -Espresso&Work-の住所が確認できる


  # Do together failing
  @ignore
  Scenario: FRAGMENTS COFFEE STAND
    Given: FRAGMENTS COFFEE STAND
