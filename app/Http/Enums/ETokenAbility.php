<?php

namespace App\Http\Enums;

use App\Http\Traits\EnumToArray;

enum ETokenAbility: string
{
  use EnumToArray;
  case ISSUE_ACCESS_TOKEN = 'issue-access-token';
  case ACCESS_API = 'access-api';
}
